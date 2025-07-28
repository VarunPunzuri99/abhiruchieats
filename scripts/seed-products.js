const mongoose = require('mongoose');

// Product Schema
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [500, 'Product description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Product image URL is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      enum: {
        values: ['Pickles', 'Snacks', 'Sweets', 'Beverages', 'Main Course', 'Other'],
        message: 'Please select a valid category',
      },
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const sampleProducts = [
  {
    name: "Traditional Mango Pickle",
    description: "Authentic homemade mango pickle made with fresh mangoes, traditional spices, and mustard oil. A perfect blend of tangy and spicy flavors.",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&h=500&fit=crop",
    category: "Pickles",
    inStock: true
  },
  {
    name: "Spicy Lemon Pickle",
    description: "Zesty lemon pickle with a perfect balance of sourness and spice. Made with fresh lemons and aromatic spices.",
    price: 249,
    imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=500&fit=crop",
    category: "Pickles",
    inStock: true
  },
  {
    name: "Mixed Vegetable Pickle",
    description: "A delightful mix of seasonal vegetables pickled in traditional spices. Perfect accompaniment to any meal.",
    price: 329,
    imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&h=500&fit=crop",
    category: "Pickles",
    inStock: true
  },
  {
    name: "Masala Peanuts",
    description: "Crunchy roasted peanuts coated with aromatic spices. Perfect snack for tea time or any time craving.",
    price: 149,
    imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&h=500&fit=crop",
    category: "Snacks",
    inStock: true
  },
  {
    name: "Banana Chips",
    description: "Crispy and golden banana chips made from fresh bananas. A healthy and tasty snack option.",
    price: 179,
    imageUrl: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500&h=500&fit=crop",
    category: "Snacks",
    inStock: true
  },
  {
    name: "Gulab Jamun",
    description: "Soft and spongy milk dumplings soaked in aromatic sugar syrup. A classic Indian sweet that melts in your mouth.",
    price: 399,
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=500&fit=crop",
    category: "Sweets",
    inStock: true
  },
  {
    name: "Rasgulla",
    description: "Soft and spongy cottage cheese balls in light sugar syrup. A Bengali delicacy loved by all.",
    price: 349,
    imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=500&fit=crop",
    category: "Sweets",
    inStock: true
  },
  {
    name: "Masala Chai",
    description: "Traditional Indian spiced tea blend with cardamom, cinnamon, ginger, and other aromatic spices.",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&h=500&fit=crop",
    category: "Beverages",
    inStock: true
  },
  {
    name: "Fresh Lime Water",
    description: "Refreshing lime water with a hint of mint and black salt. Perfect for hot summer days.",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop",
    category: "Beverages",
    inStock: true
  },
  {
    name: "Butter Chicken",
    description: "Rich and creamy tomato-based curry with tender chicken pieces. Served with aromatic basmati rice.",
    price: 449,
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=500&fit=crop",
    category: "Main Course",
    inStock: true
  }
];

async function seedProducts() {
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

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Create sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Created ${products.length} sample products:`);
    
    products.forEach(product => {
      console.log(`- ${product.name} (${product.category}) - ₹${product.price}`);
    });

  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedProducts();
