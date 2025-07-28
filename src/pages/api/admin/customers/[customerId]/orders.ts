import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../../../lib/mongodb';
import Order from '../../../../../../models/Order';
import Admin from '../../../../../../models/Admin';

type Data = {
  success: boolean;
  data?: any[];
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;
  const { customerId } = req.query;

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
        if (!customerId) {
          return res.status(400).json({
            success: false,
            error: 'Customer ID is required',
          });
        }

        // Get orders for specific customer
        const orders = await Order.find({ userId: customerId })
          .sort({ createdAt: -1 })
          .select('orderNumber total status createdAt items');

        res.status(200).json({
          success: true,
          data: orders,
        });
      } catch (error) {
        console.error('Error fetching customer orders:', error);
        res.status(400).json({
          success: false,
          error: 'Failed to fetch customer orders',
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
