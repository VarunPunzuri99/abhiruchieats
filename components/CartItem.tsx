import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '../contexts/CartContext';
import { ICartItem } from '../models/Cart';

interface CartItemProps {
  item: ICartItem;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity === quantity) return;

    setIsUpdating(true);
    try {
      await updateCartItem(item._id.toString(), newQuantity);
      setQuantity(newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Revert quantity on error
      setQuantity(item.quantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeFromCart(item._id.toString());
    } catch (error) {
      console.error('Error removing item:', error);
      setIsRemoving(false);
    }
  };

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    handleQuantityChange(newQuantity);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      handleQuantityChange(newQuantity);
    }
  };

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value) || 1;
    setQuantity(newQuantity);
  };

  const handleQuantityBlur = () => {
    if (quantity !== item.quantity) {
      handleQuantityChange(quantity);
    }
  };

  return (
    <div className={`p-6 transition-opacity ${isRemoving ? 'opacity-50' : ''}`}>
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="relative h-24 w-24 rounded-lg overflow-hidden">
            <Image
              src={item.productImageUrl}
              alt={item.productName}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {item.productName}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {item.productDescription}
              </p>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {item.productCategory}
                </span>
                <span className="text-lg font-semibold text-green-600">
                  ₹{item.productPrice.toFixed(2)} each
                </span>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="ml-4 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              title="Remove from cart"
            >
              {isRemoving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Quantity and Total */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Quantity:</span>
              
              {/* Quantity Controls */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1 || isUpdating}
                  className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityInput}
                  onBlur={handleQuantityBlur}
                  disabled={isUpdating}
                  className="w-16 text-center border-0 focus:ring-0 disabled:opacity-50"
                />
                
                <button
                  onClick={incrementQuantity}
                  disabled={isUpdating}
                  className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>

              {isUpdating && (
                <div className="flex items-center text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                  Updating...
                </div>
              )}
            </div>

            {/* Item Total */}
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                ₹{item.totalPrice.toFixed(2)}
              </p>
              {quantity > 1 && (
                <p className="text-sm text-gray-500">
                  {quantity} × ₹{item.productPrice.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
