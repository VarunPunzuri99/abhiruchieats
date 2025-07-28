const mongoose = require('mongoose');

// Order Schema
const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  productImageUrl: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
      trim: true,
      lowercase: true,
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    items: [OrderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
      default: 'pending',
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// Sample orders for testing (replace with actual user ID from your database)
const sampleOrders = [
  {
    userId: "test-user-123", // Replace with actual user ID
    userEmail: "customer@example.com",
    userName: "Test Customer",
    items: [
      {
        productId: "1",
        productName: "Traditional Mango Pickle",
        productDescription: "Authentic homemade mango pickle made with fresh mangoes, traditional spices, and mustard oil.",
        productPrice: 299,
        productImageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&h=500&fit=crop",
        productCategory: "Pickles",
        quantity: 2,
        totalPrice: 598
      },
      {
        productId: "4",
        productName: "Masala Peanuts",
        productDescription: "Crunchy roasted peanuts coated with aromatic spices.",
        productPrice: 149,
        productImageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&h=500&fit=crop",
        productCategory: "Snacks",
        quantity: 1,
        totalPrice: 149
      }
    ],
    subtotal: 747,
    tax: 75,
    total: 822,
    status: 'delivered',
    orderNumber: 'AE-TEST-001'
  },
  {
    userId: "test-user-123",
    userEmail: "customer@example.com",
    userName: "Test Customer",
    items: [
      {
        productId: "6",
        productName: "Gulab Jamun",
        productDescription: "Soft and spongy milk dumplings soaked in aromatic sugar syrup.",
        productPrice: 399,
        productImageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=500&fit=crop",
        productCategory: "Sweets",
        quantity: 1,
        totalPrice: 399
      }
    ],
    subtotal: 399,
    tax: 40,
    total: 439,
    status: 'preparing',
    orderNumber: 'AE-TEST-002'
  },
  {
    userId: "test-user-123",
    userEmail: "customer@example.com",
    userName: "Test Customer",
    items: [
      {
        productId: "10",
        productName: "Butter Chicken",
        productDescription: "Rich and creamy tomato-based curry with tender chicken pieces.",
        productPrice: 449,
        productImageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=500&fit=crop",
        productCategory: "Main Course",
        quantity: 1,
        totalPrice: 449
      },
      {
        productId: "8",
        productName: "Masala Chai",
        productDescription: "Traditional Indian spiced tea blend with cardamom, cinnamon, ginger.",
        productPrice: 199,
        productImageUrl: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&h=500&fit=crop",
        productCategory: "Beverages",
        quantity: 2,
        totalPrice: 398
      }
    ],
    subtotal: 847,
    tax: 85,
    total: 932,
    status: 'pending',
    orderNumber: 'AE-TEST-003'
  }
];

async function seedOrders() {
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

    // Create sample orders
    const orders = await Order.insertMany(sampleOrders);
    console.log(`Created ${orders.length} sample orders:`);
    
    orders.forEach(order => {
      console.log(`- ${order.orderNumber} (${order.status}) - ₹${order.total} - ${order.items.length} items`);
    });

    console.log('\n📝 Note: These orders are created with a test user ID.');
    console.log('To see them in the UI, you need to:');
    console.log('1. Sign in as a customer');
    console.log('2. Update the userId in the orders to match your actual user ID');
    console.log('3. Or modify the script to use your actual user ID');

  } catch (error) {
    console.error('Error seeding orders:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedOrders();
