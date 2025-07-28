import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../../lib/mongodb';
import Product, { IProduct } from '../../../../../models/Product';
import Admin from '../../../../../models/Admin';

type Data = {
  success: boolean;
  data?: IProduct;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;
  const { productId } = req.query;

  // Connect to MongoDB
  await dbConnect();

  // Check admin authentication
  const adminToken = req.cookies['admin-token'];
  
  if (!adminToken) {
    return res.status(401).json({
      success: false,
      error: 'Admin authentication required',
    });
  }

  try {
    // Verify admin token
    const decoded = jwt.verify(adminToken, process.env.ADMIN_JWT_SECRET || 'admin-secret-key') as any;
    
    // Verify admin exists and is active
    const admin = await Admin.findById(decoded.adminId);
    if (!admin || !admin.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Admin access denied',
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid admin token',
    });
  }

  switch (method) {
    case 'PUT':
      try {
        const { name, description, price, category, imageUrl, inStock } = req.body;

        // Validation
        if (!name || !description || !price || !category || !imageUrl) {
          return res.status(400).json({
            success: false,
            error: 'All fields are required',
          });
        }

        if (price <= 0) {
          return res.status(400).json({
            success: false,
            error: 'Price must be greater than 0',
          });
        }

        // Update product
        const product = await Product.findByIdAndUpdate(
          productId,
          {
            name,
            description,
            price: parseFloat(price),
            category,
            imageUrl,
            inStock: inStock !== undefined ? inStock : true,
          },
          { new: true, runValidators: true }
        );

        if (!product) {
          return res.status(404).json({
            success: false,
            error: 'Product not found',
          });
        }

        res.status(200).json({
          success: true,
          data: product,
          message: 'Product updated successfully',
        });
      } catch (error: any) {
        console.error('Error updating product:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
          const validationErrors = Object.values(error.errors).map(
            (err: any) => err.message
          );
          return res.status(400).json({
            success: false,
            error: validationErrors.join(', '),
          });
        }

        // Handle duplicate key error
        if (error.code === 11000) {
          return res.status(400).json({
            success: false,
            error: 'Product with this name already exists',
          });
        }

        res.status(400).json({
          success: false,
          error: 'Failed to update product',
        });
      }
      break;

    case 'DELETE':
      try {
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
          return res.status(404).json({
            success: false,
            error: 'Product not found',
          });
        }

        res.status(200).json({
          success: true,
          message: 'Product deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        res.status(400).json({
          success: false,
          error: 'Failed to delete product',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).json({
        success: false,
        error: `Method ${method} Not Allowed`,
      });
      break;
  }
}
