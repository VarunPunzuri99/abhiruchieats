import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/mongodb';
import Admin from '../../../../models/Admin';

type Data = {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  // Only allow in development or with special key
  if (process.env.NODE_ENV === 'production' && req.headers['x-seed-key'] !== process.env.SEED_KEY) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
    });
  }

  try {
    // Connect to MongoDB
    await dbConnect();

    // Check if any admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        error: 'Admin already exists',
      });
    }

    // Create default admin
    const defaultAdmin = await Admin.create({
      email: 'admin@abhiruchieats.com',
      password: 'admin123', // This will be hashed automatically
      name: 'AbhiruchiEats Admin',
      role: 'super_admin',
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Default admin created successfully',
      data: {
        email: defaultAdmin.email,
        name: defaultAdmin.name,
        role: defaultAdmin.role,
      },
    });
  } catch (error: any) {
    console.error('Admin seeding error:', error);

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

    res.status(500).json({
      success: false,
      error: 'Failed to create admin',
    });
  }
}
