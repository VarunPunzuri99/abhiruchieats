import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import Product, { IProduct } from '../../../models/Product';

type Data = {
  success: boolean;
  data?: IProduct | IProduct[];
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  // Connect to MongoDB
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const { category } = req.query;

        // Build query filter
        const filter: any = {};
        if (category && category !== 'all') {
          filter.category = category;
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
          success: true,
          data: products,
        });
      } catch (error) {
        console.error('Error fetching products:', error);
        res.status(400).json({
          success: false,
          error: 'Failed to fetch products',
        });
      }
      break;

    case 'POST':
      try {
        const { name, description, price, imageUrl, category } = req.body;

        // Validate required fields
        if (!name || !description || !price || !imageUrl || !category) {
          return res.status(400).json({
            success: false,
            error: 'All fields are required: name, description, price, imageUrl, category',
          });
        }

        // Validate price
        if (isNaN(price) || price < 0) {
          return res.status(400).json({
            success: false,
            error: 'Price must be a valid positive number',
          });
        }

        const product = await Product.create({
          name,
          description,
          price: parseFloat(price),
          imageUrl,
          category,
        });

        res.status(201).json({
          success: true,
          data: product,
          message: 'Product created successfully',
        });
      } catch (error: any) {
        console.error('Error creating product:', error);

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

        res.status(400).json({
          success: false,
          error: 'Failed to create product',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        success: false,
        error: `Method ${method} Not Allowed`,
      });
      break;
  }
}
