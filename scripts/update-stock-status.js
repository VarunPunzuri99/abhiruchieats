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

async function updateStockStatus() {
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

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    if (products.length === 0) {
      console.log('No products found. Please run the seed-products script first.');
      return;
    }

    // Set some products as out of stock for testing
    const productsToMarkOutOfStock = [
      'Spicy Lemon Pickle',
      'Banana Chips',
      'Fresh Lime Water'
    ];

    let updatedCount = 0;

    for (const productName of productsToMarkOutOfStock) {
      const result = await Product.updateOne(
        { name: productName },
        { inStock: false }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Marked "${productName}" as out of stock`);
        updatedCount++;
      } else {
        console.log(`⚠️  Product "${productName}" not found or already out of stock`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`- Total products: ${products.length}`);
    console.log(`- Marked out of stock: ${updatedCount}`);
    console.log(`- Still in stock: ${products.length - updatedCount}`);

    // Display current stock status
    const allProducts = await Product.find({}).sort({ name: 1 });
    console.log('\n📋 Current Stock Status:');
    allProducts.forEach(product => {
      const status = product.inStock ? '✅ In Stock' : '❌ Out of Stock';
      console.log(`- ${product.name}: ${status}`);
    });

  } catch (error) {
    console.error('Error updating stock status:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

updateStockStatus();
