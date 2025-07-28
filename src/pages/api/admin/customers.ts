import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import Admin from '../../../../models/Admin';

type CustomerData = {
  _id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date | null;
  status: string;
};

type Data = {
  success: boolean;
  data?: CustomerData[];
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
    case 'GET':
      try {
        // Aggregate customer data from orders
        const customers = await Order.aggregate([
          {
            $group: {
              _id: '$userId',
              name: { $first: '$userName' },
              email: { $first: '$userEmail' },
              totalOrders: { $sum: 1 },
              totalSpent: { $sum: '$total' },
              lastOrderDate: { $max: '$createdAt' },
              orders: { $push: '$$ROOT' }
            }
          },
          {
            $addFields: {
              status: {
                $cond: {
                  if: { $gte: ['$lastOrderDate', { $subtract: [new Date(), 30 * 24 * 60 * 60 * 1000] }] },
                  then: 'active',
                  else: 'inactive'
                }
              }
            }
          },
          {
            $sort: { totalSpent: -1 }
          },
          {
            $project: {
              orders: 0 // Remove orders array from response for performance
            }
          }
        ]);

        res.status(200).json({
          success: true,
          data: customers,
        });
      } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(400).json({
          success: false,
          error: 'Failed to fetch customers',
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
