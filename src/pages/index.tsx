import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import ProductCard from '../../components/ProductCard';
import UserMenu from '../../components/UserMenu';
import { IProduct } from '../../models/Product';
import { useCart } from '../../contexts/CartContext';

interface HomeProps {
  initialProducts: IProduct[];
}

export default function Home({ initialProducts }: HomeProps) {
  const { data: session } = useSession();
  const [products, setProducts] = useState<IProduct[]>(initialProducts || []);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all'); // 'all', 'inStock', 'outOfStock'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount, cartTotal } = useCart();

  const categories = ['all', 'Pickles', 'Snacks', 'Sweets', 'Beverages', 'Main Course', 'Other'];

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]); 

  // Fetch products based on selected category
  const fetchProducts = async (category: string) => {
    setLoading(true);
    setError('');

    try {
      const url = category === 'all'
        ? '/api/products'
        : `/api/products?category=${encodeURIComponent(category)}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchProducts(category);
  };

  const handleStockFilterChange = (filter: string) => {
    setStockFilter(filter);
  };

  // Filter products based on category and stock status
  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const stockMatch = stockFilter === 'all' ||
                      (stockFilter === 'inStock' && product.inStock) ||
                      (stockFilter === 'outOfStock' && !product.inStock);
    return categoryMatch && stockMatch;
  });

  // Remove the old handleAddToCart function since ProductCard now handles it internally

  return (
    <>
      <Head>
        <title>AbhiruchiEats - Homemade Food Delights</title>
        <meta name="description" content="Discover delicious homemade food items including pickles, snacks, and traditional delicacies at AbhiruchiEats." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <div className="flex items-center min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold text-green-600 truncate">AbhiruchiEats</h1>
                <span className="ml-2 text-xs sm:text-sm text-gray-500 hidden sm:block">Homemade Delights</span>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8">
                  <Link href="/" className="text-green-600 font-medium">Home</Link>
                  <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">About</Link>
                  <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">Contact</Link>
                </nav>

                {/* Cart Icon */}
                <Link href="/cart" className="relative p-2 text-gray-700 hover:text-green-600 transition-colors touch-manipulation">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2-2v4m16 0H4" />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="hidden md:block">
                  <UserMenu />
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-gray-700 hover:text-green-600 transition-colors touch-manipulation"
                  aria-label="Toggle mobile menu"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-gray-200 py-3 animate-fade-in">
                <nav className="flex flex-col space-y-2">
                  <Link
                    href="/"
                    className="flex items-center px-4 py-3 text-green-600 font-medium bg-green-50 rounded-lg touch-manipulation"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-base">Home</span>
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors touch-manipulation"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-base">About Us</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors touch-manipulation"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-base">Contact Us</span>
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors touch-manipulation"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2-2v4m16 0H4" />
                    </svg>
                    <span className="text-base">Shopping Cart</span>
                    {itemCount > 0 && (
                      <span className="ml-auto bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                  {session && (
                    <Link
                      href="/orders"
                      className="flex items-center px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors touch-manipulation"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className="text-base">My Orders</span>
                    </Link>
                  )}
                </nav>

                {/* Mobile Authentication Section */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {session?.user ? (
                    // Signed In User Section
                    <div className="space-y-3">
                      {/* User Info */}
                      <div className="flex items-center px-4 py-3 bg-green-50 rounded-lg">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-green-100 flex-shrink-0">
                          {session.user.image ? (
                            <Image
                              src={session.user.image}
                              alt={session.user.name || 'User'}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-green-600 font-medium">
                              {session.user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          )}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {session.user.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session.user.email}
                          </p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            Customer
                          </span>
                        </div>
                      </div>

                      {/* Profile Link */}
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors touch-manipulation"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-base">Profile Settings</span>
                      </Link>

                      {/* Sign Out Button */}
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="flex items-center w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                      >
                        <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="text-base">Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    // Not Signed In Section
                    <div className="space-y-3">
                      {/* Sign In Button */}
                      <Link
                        href="/auth/signin"
                        className="flex items-center justify-center w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors touch-manipulation"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="text-base font-medium">Sign In</span>
                      </Link>

                      {/* Benefits */}
                      <div className="px-4 py-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-2">Sign in to:</p>
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li className="flex items-center">
                            <svg className="w-3 h-3 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Save your cart across devices
                          </li>
                          <li className="flex items-center">
                            <svg className="w-3 h-3 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Track your order history
                          </li>
                          <li className="flex items-center">
                            <svg className="w-3 h-3 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Faster checkout process
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Authentic Homemade Food
            </h2>
            <p className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-8 text-green-100 px-4">
              Discover the taste of tradition with our handcrafted pickles and delicacies
            </p>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Filters */}
          <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
            {/* Category Filter */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Shop by Category</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors touch-manipulation ${
                      selectedCategory === category
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {category === 'all' ? 'All Products' : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Filter by Availability</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={() => handleStockFilterChange('all')}
                  className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors touch-manipulation ${
                    stockFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => handleStockFilterChange('inStock')}
                  className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors touch-manipulation ${
                    stockFilter === 'inStock'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  ✅ In Stock Only
                </button>
                <button
                  onClick={() => handleStockFilterChange('outOfStock')}
                  className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors touch-manipulation ${
                    stockFilter === 'outOfStock'
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  ❌ Out of Stock
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          )}

          {/* Products Grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id.toString()}
                    product={product}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 sm:py-12">
                  <div className="text-6xl mb-4">
                    {stockFilter === 'outOfStock' ? '📦' : selectedCategory === 'all' ? '🍽️' : '🔍'}
                  </div>
                  <p className="text-gray-500 text-base sm:text-lg px-4 mb-2">
                    {stockFilter === 'outOfStock'
                      ? 'No out of stock items found.'
                      : stockFilter === 'inStock'
                      ? 'No in-stock items found in this category.'
                      : selectedCategory === 'all'
                      ? 'No products available at the moment.'
                      : `No products found in ${selectedCategory} category.`}
                  </p>
                  {stockFilter !== 'all' && (
                    <button
                      onClick={() => handleStockFilterChange('all')}
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      Show all items
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Results Summary */}
          {!loading && filteredProducts.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                Showing {filteredProducts.length} of {products.length} products
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                {stockFilter === 'inStock' && ' (In Stock)'}
                {stockFilter === 'outOfStock' && ' (Out of Stock)'}
              </p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">AbhiruchiEats</h3>
              <p className="text-gray-400 mb-4">Bringing homemade goodness to your doorstep</p>
              <p className="text-sm text-gray-500">
                © 2024 AbhiruchiEats. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

// Server-side rendering to fetch initial products
export async function getServerSideProps() {
  try {
    // In production, this would be your actual domain
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products`);
    const data = await response.json();

    return {
      props: {
        initialProducts: data.success ? data.data : [],
      },
    };
  } catch (error) {
    console.error('Error fetching initial products:', error);
    return {
      props: {
        initialProducts: [],
      },
    };
  }
}
