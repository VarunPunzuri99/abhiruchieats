const fetch = require('node-fetch');

// Test script to verify stock validation in cart API
async function testStockValidation() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🧪 Testing Stock Validation in Cart API\n');

  try {
    // First, get all products to find in-stock and out-of-stock items
    console.log('1. Fetching products...');
    const productsResponse = await fetch(`${baseUrl}/api/products`);
    const productsData = await productsResponse.json();
    
    if (!productsData.success) {
      throw new Error('Failed to fetch products');
    }

    const products = productsData.data;
    const inStockProduct = products.find(p => p.inStock);
    const outOfStockProduct = products.find(p => !p.inStock);

    console.log(`   Found ${products.length} products total`);
    console.log(`   In stock products: ${products.filter(p => p.inStock).length}`);
    console.log(`   Out of stock products: ${products.filter(p => !p.inStock).length}\n`);

    if (inStockProduct) {
      console.log(`✅ Testing with IN STOCK product: "${inStockProduct.name}"`);
      
      // Test adding in-stock product to cart
      const inStockResponse = await fetch(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': 'test-session-123'
        },
        body: JSON.stringify({
          productId: inStockProduct._id,
          productName: inStockProduct.name,
          productDescription: inStockProduct.description,
          productPrice: inStockProduct.price,
          productImageUrl: inStockProduct.imageUrl,
          productCategory: inStockProduct.category,
          quantity: 1
        })
      });

      const inStockResult = await inStockResponse.json();
      
      if (inStockResponse.ok && inStockResult.success) {
        console.log(`   ✅ SUCCESS: In-stock product added to cart`);
        console.log(`   Response: ${inStockResult.message}\n`);
      } else {
        console.log(`   ❌ UNEXPECTED: In-stock product was rejected`);
        console.log(`   Error: ${inStockResult.error}\n`);
      }
    }

    if (outOfStockProduct) {
      console.log(`❌ Testing with OUT OF STOCK product: "${outOfStockProduct.name}"`);
      
      // Test adding out-of-stock product to cart
      const outOfStockResponse = await fetch(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': 'test-session-456'
        },
        body: JSON.stringify({
          productId: outOfStockProduct._id,
          productName: outOfStockProduct.name,
          productDescription: outOfStockProduct.description,
          productPrice: outOfStockProduct.price,
          productImageUrl: outOfStockProduct.imageUrl,
          productCategory: outOfStockProduct.category,
          quantity: 1
        })
      });

      const outOfStockResult = await outOfStockResponse.json();
      
      if (!outOfStockResponse.ok && !outOfStockResult.success) {
        console.log(`   ✅ SUCCESS: Out-of-stock product was correctly rejected`);
        console.log(`   Error message: "${outOfStockResult.error}"\n`);
      } else {
        console.log(`   ❌ FAILURE: Out-of-stock product was incorrectly added to cart`);
        console.log(`   This should not happen!\n`);
      }
    }

    console.log('🎉 Stock validation test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testStockValidation();
