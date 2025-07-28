import React, { useState } from 'react';
import Image from 'next/image';
import { IProduct } from '../models/Product';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({  product }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    // Prevent adding out of stock items
    if (!product.inStock) {
      alert('This item is currently out of stock and cannot be added to cart.');
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 ${!product.inStock ? 'opacity-75' : ''}`}>
      {/* Product Image */}
      <div className="relative h-48 w-full">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className={`object-cover transition-all duration-300 ${!product.inStock ? 'grayscale' : ''}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            product.inStock
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
          </span>
        </div>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">
              OUT OF STOCK
            </div>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Product Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {product.description}
        </p>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className={`text-xl sm:text-2xl font-bold ${product.inStock ? 'text-green-600' : 'text-gray-400'}`}>
              ₹{product.price.toFixed(2)}
            </span>
            {!product.inStock && (
              <span className="text-xs text-red-600 font-medium mt-1">
                Currently unavailable
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || !product.inStock}
            className={`font-medium py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 focus:outline-none text-sm sm:text-base touch-manipulation ${
              !product.inStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : showSuccess
                ? 'bg-green-500 text-white focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                : isAdding
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            }`}
          >
            {!product.inStock ? (
              <>
                <span className="hidden sm:inline">Out of Stock</span>
                <span className="sm:hidden">N/A</span>
              </>
            ) : isAdding ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span className="hidden sm:inline">Adding...</span>
                <span className="sm:hidden">...</span>
              </div>
            ) : showSuccess ? (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Added!</span>
                <span className="sm:hidden">✓</span>
              </div>
            ) : (
              <>
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
