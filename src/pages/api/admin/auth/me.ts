import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../../lib/mongodb';
import Admin from '../../../../../models/Admin';

type Data = {
  success: boolean;
  data?: {
    admin: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  };
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    // Get token from cookie
    const token = req.cookies['admin-token'];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET || 'admin-secret-key') as any;

    // Connect to MongoDB
    await dbConnect();

    // Find admin
    const admin = await Admin.findById(decoded.adminId);

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Admin not found or inactive',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          isDefaultPassword: admin.isDefaultPassword,
        },
      },
    });
  } catch (error) {
    console.error('Admin auth check error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }
}
