import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import dbConnect from '../../../lib/mongodb';
import Order, { IOrder } from '../../../models/Order';
import CartItem from '../../../models/Cart';

type Data = {
  success: boolean;
  data?: IOrder | IOrder[] | { orderNumber: string };
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

  // Get session (user authentication required)
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.id) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  switch (method) {
    case 'GET':
      try {
        const { orderId } = req.query;

        if (orderId) {
          // Get specific order
          const order = await Order.findOne({
            _id: orderId,
            userId: session.user.id,
          });

          if (!order) {
            return res.status(404).json({
              success: false,
              error: 'Order not found',
            });
          }

          res.status(200).json({
            success: true,
            data: order,
          });
        } else {
          // Get all orders for user
          const orders = await Order.find({ userId: session.user.id })
            .sort({ createdAt: -1 });

          res.status(200).json({
            success: true,
            data: orders,
          });
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(400).json({
          success: false,
          error: 'Failed to fetch orders',
        });
      }
      break;

    case 'POST':
      try {
        // Create new order from cart
        const cartFilter = { userId: session.user.id };
        const cartItems = await CartItem.find(cartFilter);

        if (cartItems.length === 0) {
          return res.status(400).json({
            success: false,
            error: 'Cart is empty',
          });
        }

        // Calculate totals
        const subtotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
        const tax = subtotal * 0.05; // 5% tax
        const total = subtotal + tax;

        // Generate order number
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        const orderNumber = `AE-${timestamp}-${random}`.toUpperCase();

        // Create order
        const order = await Order.create({
          userId: session.user.id,
          userEmail: session.user.email,
          userName: session.user.name,
          orderNumber,
          items: cartItems.map(item => ({
            productId: item.productId,
            productName: item.productName,
            productDescription: item.productDescription,
            productPrice: item.productPrice,
            productImageUrl: item.productImageUrl,
            productCategory: item.productCategory,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
          })),
          subtotal,
          tax,
          total,
          status: 'pending',
        });

        // Clear cart after successful order creation
        await CartItem.deleteMany(cartFilter);

        res.status(201).json({
          success: true,
          data: { orderNumber: order.orderNumber },
          message: 'Order created successfully',
        });
      } catch (error: any) {
        console.error('Error creating order:', error);

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
          error: 'Failed to create order',
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
