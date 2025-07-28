import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { ICartItem } from '../models/Cart';

interface CartState {
  items: ICartItem[];
  cartTotal: number;
  itemCount: number;
  loading: boolean;
  sessionId: string | null;
}

interface CartContextType extends CartState {
  addToCart: (product: any, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART_DATA'; payload: { items: ICartItem[]; cartTotal: number; itemCount: number } }
  | { type: 'SET_SESSION_ID'; payload: string }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  cartTotal: 0,
  itemCount: 0,
  loading: false,
  sessionId: null,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CART_DATA':
      return {
        ...state,
        items: action.payload.items,
        cartTotal: action.payload.cartTotal,
        itemCount: action.payload.itemCount,
        loading: false,
      };
    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload };
    case 'CLEAR_CART':
      return { ...state, items: [], cartTotal: 0, itemCount: 0 };
    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { data: session, status } = useSession();

  // Generate or retrieve session ID for non-authenticated users
  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load

    if (!session) {
      // For non-authenticated users, use session ID
      let sessionId = localStorage.getItem('cart-session-id');
      if (!sessionId) {
        sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('cart-session-id', sessionId);
      }
      dispatch({ type: 'SET_SESSION_ID', payload: sessionId });
    } else {
      // For authenticated users, clear session ID and use user ID
      localStorage.removeItem('cart-session-id');
      dispatch({ type: 'SET_SESSION_ID', payload: null });
    }
  }, [session, status]);

  // Fetch cart data when session changes or session ID is available
  useEffect(() => {
    if (status === 'loading') return;

    if (session || state.sessionId) {
      refreshCart();
    }
  }, [session, state.sessionId, status]);

  const makeRequest = async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Only add session ID header for non-authenticated users
    if (!session && state.sessionId) {
      headers['x-session-id'] = state.sessionId;
    }

    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  };

  const refreshCart = async () => {
    if (!session && !state.sessionId) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await makeRequest('/api/cart');
      dispatch({
        type: 'SET_CART_DATA',
        payload: {
          items: data.data.items,
          cartTotal: data.data.cartTotal,
          itemCount: data.data.itemCount,
        },
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (product: any, quantity: number = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await makeRequest('/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          productId: product._id.toString(),
          productName: product.name,
          productDescription: product.description,
          productPrice: product.price,
          productImageUrl: product.imageUrl,
          productCategory: product.category,
          quantity,
        }),
      });

      await refreshCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await makeRequest('/api/cart', {
        method: 'PUT',
        body: JSON.stringify({ itemId, quantity }),
      });

      await refreshCart();
    } catch (error) {
      console.error('Error updating cart item:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await makeRequest(`/api/cart?itemId=${itemId}`, {
        method: 'DELETE',
      });

      await refreshCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const value: CartContextType = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
