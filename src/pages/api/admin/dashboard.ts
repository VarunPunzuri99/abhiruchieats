import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../lib/mongodb';
import Admin from '../../../../models/Admin';
import Order from '../../../../models/Order';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get token from cookie
    const token = req.cookies['admin-token'];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET || 'admin-secret-key') as any;

    // Connect to MongoDB
    await dbConnect();

    // Find admin
    const admin = await Admin.findById(decoded.adminId);

    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Admin not found or inactive' });
    }

    // Get current date for today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Aggregate dashboard statistics
    const [
      totalOrdersResult,
      pendingOrdersResult,
      totalRevenueResult,
      todaysOrdersResult
    ] = await Promise.all([
      // Total orders count
      Order.countDocuments(),

      // Pending orders count
      Order.countDocuments({ status: 'pending' }),

      // Total revenue
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),

      // Today's orders count
      Order.countDocuments({
        createdAt: {
          $gte: today,
          $lt: tomorrow
        }
      })
    ]);

    // Extract total revenue (default to 0 if no orders)
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    const dashboardStats = {
      totalOrders: totalOrdersResult,
      pendingOrders: pendingOrdersResult,
      totalRevenue: totalRevenue,
      todaysOrders: todaysOrdersResult
    };

    res.status(200).json(dashboardStats);
  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
