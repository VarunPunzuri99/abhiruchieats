import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCart } from '../../contexts/CartContext';
import CartItem from '../../components/CartItem';
import UserMenu from '../../components/UserMenu';

const CartPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, cartTotal, itemCount, loading, refreshCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCheckout = async () => {
    if (!session) {
      // Redirect to sign in if not authenticated
      router.push('/auth/signin?callbackUrl=/cart');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Refresh cart to clear items
        await refreshCart();

        // Redirect to order confirmation
        router.push(`/orders/confirmation?orderNumber=${data.data.orderNumber}`);
      } else {
        throw new Error(data.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Shopping Cart - AbhiruchiEats</title>
        <meta name="description" content="Review and manage items in your shopping cart" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <div className="flex items-center min-w-0 flex-1">
                <Link href="/" className="text-lg sm:text-2xl font-bold text-green-600 hover:text-green-700 truncate">
                  AbhiruchiEats
                </Link>
                <span className="ml-2 text-xs sm:text-sm text-gray-500 hidden sm:block">Shopping Cart</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8">
                  <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">Home</Link>
                  <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">About</Link>
                  <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">Contact</Link>
                </nav>

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
                    className="flex items-center px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors touch-manipulation"
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
                  <Link
                    href="/cart"
                    className="flex items-center px-4 py-3 text-green-600 font-medium bg-green-50 rounded-lg touch-manipulation"
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
                </nav>
              </div>
            )}
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {items.length === 0 ? (
            // Empty Cart State
            <div className="text-center py-12 sm:py-16">
              <div className="mx-auto h-20 w-20 sm:h-24 sm:w-24 text-gray-400 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2-2v4m16 0H4" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6 sm:mb-8 px-4">Looks like you haven't added any delicious items to your cart yet.</p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            // Cart with Items
            <div className="space-y-6 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start lg:space-y-0">
              {/* Cart Items */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                      Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                    </h1>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <CartItem key={item._id.toString()} item={item} />
                    ))}
                  </div>
                </div>

                {/* Continue Shopping */}
                <div className="mt-4 sm:mt-6 px-2 sm:px-0">
                  <Link
                    href="/"
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-lg shadow-sm border lg:sticky lg:top-8">
                  <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                  </div>

                  <div className="px-4 sm:px-6 py-4 space-y-3 sm:space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                      <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">₹{(cartTotal * 0.05).toFixed(2)}</span>
                    </div>

                    <div className="border-t border-gray-200 pt-3 sm:pt-4">
                      <div className="flex justify-between text-base sm:text-lg font-semibold">
                        <span>Total</span>
                        <span>₹{(cartTotal * 1.05).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
                    {!session ? (
                      <div className="space-y-3">
                        <button
                          onClick={handleCheckout}
                          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-base touch-manipulation"
                        >
                          Sign In to Checkout
                        </button>
                        <p className="text-xs text-gray-500 text-center">
                          Sign in to save your cart and complete your order
                        </p>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={handleCheckout}
                          disabled={isProcessing}
                          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base touch-manipulation"
                        >
                          {isProcessing ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Processing...
                            </div>
                          ) : (
                            'Proceed to Checkout'
                          )}
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-2">
                          Secure checkout powered by AbhiruchiEats
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-4 sm:mt-6 bg-green-50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start sm:items-center text-sm text-green-800">
                    <svg className="w-5 h-5 mr-2 mt-0.5 sm:mt-0 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium">100% Fresh & Authentic</p>
                      <p className="text-green-600 text-xs sm:text-sm">Homemade with love and traditional recipes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
