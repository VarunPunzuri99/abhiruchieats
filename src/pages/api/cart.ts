import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import CartItem, { ICartItem } from '../../../models/Cart';
import { v4 as uuidv4 } from 'uuid';

type Data = {
  success: boolean;
  data?: ICartItem | ICartItem[] | { cartTotal: number; itemCount: number; items: ICartItem[] };
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

  // Get or create session ID
  let sessionId = req.headers['x-session-id'] as string;
  if (!sessionId) {
    sessionId = uuidv4();
    res.setHeader('x-session-id', sessionId);
  }

  switch (method) {
    case 'GET':
      try {
        const cartItems = await CartItem.find({ sessionId }).sort({ createdAt: -1 });
        
        const cartTotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
        const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
        
        res.status(200).json({
          success: true,
          data: {
            items: cartItems,
            cartTotal,
            itemCount,
          },
        });
      } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(400).json({
          success: false,
          error: 'Failed to fetch cart items',
        });
      }
      break;

    case 'POST':
      try {
        const {
          productId,
          productName,
          productDescription,
          productPrice,
          productImageUrl,
          productCategory,
          quantity = 1,
        } = req.body;

        // Validate required fields
        if (!productId || !productName || !productDescription || !productPrice || !productImageUrl || !productCategory) {
          return res.status(400).json({
            success: false,
            error: 'All product fields are required',
          });
        }

        // Check if item already exists in cart
        const existingItem = await CartItem.findOne({ sessionId, productId });

        if (existingItem) {
          // Update quantity if item already exists
          existingItem.quantity += quantity;
          existingItem.totalPrice = existingItem.quantity * existingItem.productPrice;
          await existingItem.save();

          res.status(200).json({
            success: true,
            data: existingItem,
            message: 'Cart item quantity updated',
          });
        } else {
          // Create new cart item
          const cartItem = await CartItem.create({
            sessionId,
            productId,
            productName,
            productDescription,
            productPrice: parseFloat(productPrice),
            productImageUrl,
            productCategory,
            quantity: parseInt(quantity),
            totalPrice: parseFloat(productPrice) * parseInt(quantity),
          });

          res.status(201).json({
            success: true,
            data: cartItem,
            message: 'Item added to cart',
          });
        }
      } catch (error: any) {
        console.error('Error adding to cart:', error);
        
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
          error: 'Failed to add item to cart',
        });
      }
      break;

    case 'PUT':
      try {
        const { itemId, quantity } = req.body;

        if (!itemId || !quantity) {
          return res.status(400).json({
            success: false,
            error: 'Item ID and quantity are required',
          });
        }

        if (quantity < 1) {
          return res.status(400).json({
            success: false,
            error: 'Quantity must be at least 1',
          });
        }

        const cartItem = await CartItem.findOneAndUpdate(
          { _id: itemId, sessionId },
          { 
            quantity: parseInt(quantity),
            totalPrice: 0, // Will be calculated by pre-save middleware
          },
          { new: true }
        );

        if (!cartItem) {
          return res.status(404).json({
            success: false,
            error: 'Cart item not found',
          });
        }

        // Manually calculate total price since middleware might not trigger
        cartItem.totalPrice = cartItem.quantity * cartItem.productPrice;
        await cartItem.save();

        res.status(200).json({
          success: true,
          data: cartItem,
          message: 'Cart item updated',
        });
      } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(400).json({
          success: false,
          error: 'Failed to update cart item',
        });
      }
      break;

    case 'DELETE':
      try {
        const { itemId } = req.query;

        if (!itemId) {
          return res.status(400).json({
            success: false,
            error: 'Item ID is required',
          });
        }

        const deletedItem = await CartItem.findOneAndDelete({
          _id: itemId,
          sessionId,
        });

        if (!deletedItem) {
          return res.status(404).json({
            success: false,
            error: 'Cart item not found',
          });
        }

        res.status(200).json({
          success: true,
          message: 'Item removed from cart',
        });
      } catch (error) {
        console.error('Error removing cart item:', error);
        res.status(400).json({
          success: false,
          error: 'Failed to remove cart item',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({
        success: false,
        error: `Method ${method} Not Allowed`,
      });
      break;
  }
}
