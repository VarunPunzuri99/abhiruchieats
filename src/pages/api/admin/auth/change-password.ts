import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../../lib/mongodb';
import Admin from '../../../../../models/Admin';

type Data = {
  success: boolean;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

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

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password, new password, and confirmation are required',
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters long',
      });
    }

    // Check if new password and confirmation match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'New password and confirmation do not match',
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect',
      });
    }

    // Check if new password is different from current password
    const isSamePassword = await bcrypt.compare(newPassword, admin.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        error: 'New password must be different from current password',
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update admin password and mark as no longer using default password
    await Admin.findByIdAndUpdate(admin._id, {
      password: hashedNewPassword,
      isDefaultPassword: false,
      updatedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });

  } catch (error) {
    console.error('Error changing admin password:', error);

    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid admin token',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to change password',
    });
  }
}
