# AbhiruchiEats - Homemade Food E-commerce Platform

A full-stack e-commerce web application built with Next.js, MongoDB, and Tailwind CSS for selling homemade food items like pickles, snacks, and traditional delicacies.

## 🚀 Features

- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Product Catalog**: Browse and filter products by category
- **Shopping Cart System**: Full-featured cart with database persistence
- **Cart Management**: Add, edit, remove items with real-time updates
- **Session-Based Cart**: Cart persists across browser sessions
- **About Page**: Rich storytelling with company values and mission
- **Contact Page**: Interactive contact form with business information
- **MongoDB Integration**: Robust database storage with Mongoose ODM
- **API Routes**: RESTful API endpoints for products and cart management
- **TypeScript**: Full type safety throughout the application
- **Image Optimization**: Next.js Image component with external image support
- **Server-Side Rendering**: Fast initial page loads with SSR
- **MongoDB Atlas Integration**: Connected to cloud database for production-ready data storage
- **Rich UI Components**: Animated cart interactions and user feedback

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Image Hosting**: Unsplash (for demo)
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
abhiruchieats/
├── components/
│   ├── ProductCard.tsx          # Reusable product card component
│   └── CartItem.tsx             # Cart item management component
├── contexts/
│   └── CartContext.tsx          # Global cart state management
├── data/
│   └── products.ts              # Sample product data
├── lib/
│   └── mongodb.ts               # MongoDB connection utility
├── models/
│   ├── Product.ts               # Product schema and model
│   └── Cart.ts                  # Cart item schema and model
├── src/
│   ├── pages/
│   │   ├── api/
│   │   │   ├── products.ts      # Products API endpoints
│   │   │   ├── cart.ts          # Cart API endpoints (CRUD)
│   │   │   └── seed.ts          # Database seeding endpoint
│   │   ├── _app.tsx             # App component with CartProvider
│   │   ├── _document.tsx        # Document component
│   │   ├── index.tsx            # Homepage with cart integration
│   │   ├── about.tsx            # About page with company story
│   │   ├── contact.tsx          # Contact page with form
│   │   └── cart.tsx             # Shopping cart page
│   └── styles/
│       └── globals.css          # Global styles with animations
├── types/
│   └── global.d.ts              # Global type definitions
├── .env.local                   # Environment variables
├── next.config.ts               # Next.js configuration
└── package.json                 # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd abhiruchieats
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Connection String
   MONGODB_URI=mongodb://localhost:27017/abhiruchieats
   # For MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/abhiruchieats?retryWrites=true&w=majority

   # Next.js Environment
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

4. **Start MongoDB** (if using local installation)
   ```bash
   mongod
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Database Setup

#### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start the MongoDB service
3. The application will automatically create the database and collections

#### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in `.env.local`

#### Current Setup
This application is currently configured to use MongoDB Atlas cloud database. The sample data has been seeded and the application is production-ready.

## 📊 API Endpoints

### Products API (`/api/products`)

#### GET `/api/products`
Fetch all products or filter by category.

**Query Parameters:**
- `category` (optional): Filter products by category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Traditional Mango Pickle",
      "description": "Authentic homemade mango pickle...",
      "price": 299,
      "imageUrl": "https://...",
      "category": "Pickles",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/api/products`
Create a new product.

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 299,
  "imageUrl": "https://example.com/image.jpg",
  "category": "Pickles"
}
```

### Cart API (`/api/cart`)

#### GET `/api/cart`
Fetch cart items for the current session.

**Headers:**
- `x-session-id`: Session identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "cartTotal": 558,
    "itemCount": 3
  }
}
```

#### POST `/api/cart`
Add item to cart or update quantity if item exists.

**Headers:**
- `x-session-id`: Session identifier

**Request Body:**
```json
{
  "productId": "...",
  "productName": "Product Name",
  "productDescription": "Description",
  "productPrice": 299,
  "productImageUrl": "https://...",
  "productCategory": "Pickles",
  "quantity": 2
}
```

#### PUT `/api/cart`
Update cart item quantity.

**Request Body:**
```json
{
  "itemId": "cart-item-id",
  "quantity": 3
}
```

#### DELETE `/api/cart?itemId=...`
Remove item from cart.

**Query Parameters:**
- `itemId`: Cart item ID to remove

### Seed API (`/api/seed`)

#### POST `/api/seed`
Populate the database with sample products.

## 🎨 Customization

### Adding New Categories
Update the categories array in:
- `src/pages/index.tsx` (frontend filter)
- `models/Product.ts` (database validation)

### Styling
The application uses Tailwind CSS. Customize the design by:
- Modifying component classes
- Updating `src/styles/globals.css`
- Configuring `tailwind.config.js`

### Product Schema
Extend the product model in `models/Product.ts` to add new fields like:
- Stock quantity
- Product variants
- Ratings and reviews
- Nutritional information

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The application can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## 🧪 Testing

### Manual Testing
1. Start the development server
2. Test product listing and filtering
3. Test API endpoints using tools like Postman
4. Verify responsive design on different screen sizes

### Adding Automated Tests
Consider adding:
- Unit tests with Jest
- Integration tests for API routes
- E2E tests with Playwright or Cypress

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure MongoDB is running (if using local installation)
4. Check the Next.js documentation for configuration issues

## 🌟 Current Features

### ✅ **Implemented:**
- ✅ **Product Catalog**: Browse and filter products by category
- ✅ **Shopping Cart**: Full cart system with database persistence
- ✅ **About Page**: Rich company story and values presentation
- ✅ **Contact Page**: Interactive contact form with business info
- ✅ **Responsive Design**: Mobile-friendly across all devices
- ✅ **MongoDB Integration**: Real-time data with Atlas cloud database
- ✅ **Session Management**: Cart persists across browser sessions
- ✅ **Rich UI**: Beautiful animations and color schemes

### 📱 **Available Pages:**
- 🏠 **Homepage**: http://localhost:3001 (Product catalog with cart)
- ℹ️ **About**: http://localhost:3001/about (Company story and values)
- 📞 **Contact**: http://localhost:3001/contact (Contact form and info)
- 🛒 **Cart**: http://localhost:3001/cart (Shopping cart management)

## 🔮 Future Enhancements

- User authentication and authorization
- Order management system
- Payment integration (Stripe/Razorpay)
- Admin dashboard for product management
- Product reviews and ratings
- Advanced search functionality
- Email notifications
- Inventory management
- Wishlist functionality
- Order tracking system
