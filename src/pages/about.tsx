import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useCart } from '../../contexts/CartContext';

const AboutPage: React.FC = () => {
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <>
      <Head>
        <title>About Us - AbhiruchiEats</title>
        <meta name="description" content="Learn about AbhiruchiEats - your trusted source for authentic homemade food and traditional delicacies" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-green-600 hover:text-green-700">
                  AbhiruchiEats
                </Link>
                <span className="ml-2 text-sm text-gray-500">About Us</span>
              </div>
              <div className="flex items-center space-x-4">
                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8">
                  <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">Home</Link>
                  <Link href="/about" className="text-green-600 font-medium">About</Link>
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
                    className="flex items-center px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center px-4 py-2 text-green-600 font-medium bg-green-50 rounded-lg"
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
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-orange-500 opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-500">Story</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Born from a passion for authentic flavors and traditional recipes, AbhiruchiEats brings the warmth of homemade food directly to your doorstep.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-gray-900">
                  Crafted with <span className="text-orange-500">Love</span>, 
                  Served with <span className="text-green-600">Pride</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  AbhiruchiEats was founded with a simple belief: that the best food comes from the heart. 
                  Our journey began in a small kitchen where traditional recipes were passed down through generations, 
                  each dish carrying the essence of authentic Indian flavors.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Today, we continue this legacy by bringing you handcrafted pickles, snacks, and delicacies 
                  made with the finest ingredients and time-honored techniques. Every jar tells a story, 
                  every bite connects you to our rich culinary heritage.
                </p>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-orange-400 to-green-500 rounded-3xl p-8 transform rotate-3 shadow-2xl">
                  <div className="bg-white rounded-2xl p-6 transform -rotate-3">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🥘</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Traditional Recipes</h3>
                      <p className="text-gray-600">Passed down through generations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do at AbhiruchiEats
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Authenticity */}
              <div className="text-center group">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🌶️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Authenticity</h3>
                <p className="text-gray-600 leading-relaxed">
                  We preserve traditional recipes and cooking methods, ensuring every product maintains its authentic taste and cultural significance.
                </p>
              </div>

              {/* Quality */}
              <div className="text-center group">
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">⭐</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality</h3>
                <p className="text-gray-600 leading-relaxed">
                  From sourcing the finest ingredients to careful preparation, we never compromise on quality. Every product meets our highest standards.
                </p>
              </div>

              {/* Freshness */}
              <div className="text-center group">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🌱</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Freshness</h3>
                <p className="text-gray-600 leading-relaxed">
                  Made fresh in small batches, our products are prepared with care and delivered to ensure maximum freshness and flavor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-orange-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-8">Our Mission</h2>
            <p className="text-xl text-green-100 max-w-4xl mx-auto leading-relaxed mb-8">
              To preserve and share the rich culinary traditions of India by creating authentic, 
              high-quality homemade food products that bring families together and create lasting memories 
              around the dining table.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-lg"
            >
              Get in Touch
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-orange-500 mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
                <div className="text-gray-600">Unique Products</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">5+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-orange-500 mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
                <div className="text-gray-600">Natural Ingredients</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">AbhiruchiEats</h3>
              <p className="text-gray-400 mb-6">Bringing homemade goodness to your doorstep</p>
              <div className="flex justify-center space-x-6 mb-6">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
                <Link href="/cart" className="text-gray-400 hover:text-white transition-colors">Cart</Link>
              </div>
              <p className="text-sm text-gray-500">
                © 2024 AbhiruchiEats. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AboutPage;
