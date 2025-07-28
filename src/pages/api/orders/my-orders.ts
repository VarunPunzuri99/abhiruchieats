import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../../lib/mongodb';
import Order, { IOrder } from '../../../../models/Order';

type Data = {
  success: boolean;
  data?: IOrder[];
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

  // Check if user is authenticated
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  switch (method) {
    case 'GET':
      try {
        const userId = session.user.id;
        
        if (!userId) {
          return res.status(400).json({
            success: false,
            error: 'User ID not found in session',
          });
        }

        // Get orders for the authenticated user
        const orders = await Order.find({ userId })
          .sort({ createdAt: -1 }) // Most recent first
          .lean(); // Convert to plain JavaScript objects for better performance

        res.status(200).json({
          success: true,
          data: orders,
        });
      } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to fetch orders',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).json({
        success: false,
        error: `Method ${method} Not Allowed`,
      });
      break;
  }
}
