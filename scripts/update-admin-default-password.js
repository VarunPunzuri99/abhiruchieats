const mongoose = require('mongoose');

// Admin Schema
const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDefaultPassword: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function updateAdminDefaultPassword() {
  try {
    // Load environment variables
    require('dotenv').config({ path: '.env.local' });
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find all admins
    const admins = await Admin.find({});
    console.log(`Found ${admins.length} admin(s)`);

    if (admins.length === 0) {
      console.log('No admins found. Please run the seed-admin script first.');
      return;
    }

    // Update all admins to have isDefaultPassword field
    for (const admin of admins) {
      // Check if the admin has the default password (admin123)
      // We'll assume if they haven't changed it, they're still using default
      const updateData = {};
      
      // If the field doesn't exist, set it to true (assuming default password)
      if (admin.isDefaultPassword === undefined) {
        updateData.isDefaultPassword = true;
      }

      if (Object.keys(updateData).length > 0) {
        await Admin.findByIdAndUpdate(admin._id, updateData);
        console.log(`✅ Updated admin: ${admin.email} - isDefaultPassword: ${updateData.isDefaultPassword}`);
      } else {
        console.log(`ℹ️  Admin ${admin.email} already has isDefaultPassword field: ${admin.isDefaultPassword}`);
      }
    }

    // Display current admin status
    const updatedAdmins = await Admin.find({});
    console.log('\n📋 Current Admin Status:');
    updatedAdmins.forEach(admin => {
      const passwordStatus = admin.isDefaultPassword ? '⚠️  Using Default Password' : '✅ Custom Password Set';
      console.log(`- ${admin.name} (${admin.email}): ${passwordStatus}`);
    });

    console.log('\n🔐 Security Recommendations:');
    console.log('1. Login with default credentials will now redirect to password change');
    console.log('2. Default credentials are hidden from login page after password change');
    console.log('3. Admins can change password anytime from admin panel');

  } catch (error) {
    console.error('Error updating admin default password status:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

updateAdminDefaultPassword();
