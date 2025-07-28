import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../lib/mongodb';
import Order, { IOrder } from '../../../../models/Order';
import Admin from '../../../../models/Admin';
import { sendOrderStatusEmail } from '../../../../lib/email';

type Data = {
  success: boolean;
  data?: IOrder | IOrder[] | { stats: any };
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
        const { stats } = req.query;

        if (stats === 'true') {
          // Get order statistics
          const totalOrders = await Order.countDocuments();
          const pendingOrders = await Order.countDocuments({ status: 'pending' });
          const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
          const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
          
          const totalRevenue = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
          ]);

          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          const todayOrders = await Order.countDocuments({
            createdAt: { $gte: todayStart }
          });

          res.status(200).json({
            success: true,
            data: {
              stats: {
                totalOrders,
                pendingOrders,
                confirmedOrders,
                deliveredOrders,
                todayOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
              }
            },
          });
        } else {
          // Get all orders with pagination
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 20;
          const skip = (page - 1) * limit;

          const orders = await Order.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

          const total = await Order.countDocuments();

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

    case 'PUT':
      try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
          return res.status(400).json({
            success: false,
            error: 'Order ID and status are required',
          });
        }

        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid status',
          });
        }

        // Get the current order to check if status is actually changing
        const currentOrder = await Order.findById(orderId);
        if (!currentOrder) {
          return res.status(404).json({
            success: false,
            error: 'Order not found',
          });
        }

        // Update order status
        const order = await Order.findByIdAndUpdate(
          orderId,
          { status, updatedAt: new Date() },
          { new: true }
        );

        // Send email notification if status changed
        if (currentOrder.status !== status) {
          try {
            await sendOrderStatusEmail(
              order.userEmail,
              order.userName,
              order.orderNumber,
              status,
              order.items
            );
            console.log(`Email notification sent for order ${order.orderNumber} status change to ${status}`);
          } catch (emailError) {
            console.error('Failed to send email notification:', emailError);
            // Don't fail the API call if email fails
          }
        }

        res.status(200).json({
          success: true,
          data: order,
          message: 'Order status updated successfully',
        });
      } catch (error) {
        console.error('Error updating order:', error);
        res.status(400).json({
          success: false,
          error: 'Failed to update order',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).json({
        success: false,
        error: `Method ${method} Not Allowed`,
      });
      break;
  }
}
