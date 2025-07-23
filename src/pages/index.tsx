import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ProductCard from '../../components/ProductCard';
import { IProduct } from '../../models/Product';
import { useCart } from '../../contexts/CartContext';

interface HomeProps {
  initialProducts: IProduct[];
}

export default function Home({ initialProducts }: HomeProps) {
  const [products, setProducts] = useState<IProduct[]>(initialProducts || []);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount, cartTotal } = useCart();

  const categories = ['all', 'Pickles', 'Snacks', 'Sweets', 'Beverages', 'Main Course', 'Other'];

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
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-green-600">AbhiruchiEats</h1>
                <span className="ml-2 text-sm text-gray-500 hidden sm:block">Homemade Delights</span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8">
                  <Link href="/" className="text-green-600 font-medium">Home</Link>
                  <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">About</Link>
                  <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">Contact</Link>
                </nav>

                {/* Cart Icon */}
                <Link href="/cart" className="relative p-2 text-gray-700 hover:text-green-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2-2v4m16 0H4" />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-gray-700 hover:text-green-600 transition-colors"
                  aria-label="Toggle mobile menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="md:hidden border-t border-gray-200 py-4 animate-fade-in">
                <nav className="flex flex-col space-y-4">
                  <Link
                    href="/"
                    className="flex items-center px-4 py-2 text-green-600 font-medium bg-green-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    About Us
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Us
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2-2v4m16 0H4" />
                    </svg>
                    Shopping Cart
                    {itemCount > 0 && (
                      <span className="ml-auto bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Authentic Homemade Food
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Discover the taste of tradition with our handcrafted pickles and delicacies
            </p>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Filter */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop by Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product._id.toString()}
                    product={product}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {selectedCategory === 'all'
                      ? 'No products available at the moment.'
                      : `No products found in ${selectedCategory} category.`}
                  </p>
                </div>
              )}
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
