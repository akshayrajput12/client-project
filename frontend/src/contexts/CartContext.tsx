import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, AddToCartRequest, UpdateCartRequest } from '../types/Product';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  cartSummary: { total_items: number; total_quantity: number; total_price: number };
  isLoading: boolean;
  addToCart: (item: AddToCartRequest) => Promise<void>;
  updateCartItem: (id: number, update: UpdateCartRequest) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState({ total_items: 0, total_quantity: 0, total_price: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load cart when user logs in
  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      // Clear cart when user logs out
      setCartItems([]);
      setCartSummary({ total_items: 0, total_quantity: 0, total_price: 0 });
    }
  }, [user]);

  const refreshCart = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [items, summary] = await Promise.all([
        apiService.getCart(),
        apiService.getCartSummary()
      ]);
      setCartItems(items);
      setCartSummary(summary);
    } catch (error) {
      console.error('Failed to refresh cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (item: AddToCartRequest) => {
    try {
      await apiService.addToCart(item);
      await refreshCart(); // Refresh to get updated cart
    } catch (error) {
      throw error;
    }
  };

  const updateCartItem = async (id: number, update: UpdateCartRequest) => {
    try {
      await apiService.updateCartItem(id, update);
      await refreshCart(); // Refresh to get updated cart
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (id: number) => {
    try {
      await apiService.removeFromCart(id);
      await refreshCart(); // Refresh to get updated cart
    } catch (error) {
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await apiService.clearCart();
      setCartItems([]);
      setCartSummary({ total_items: 0, total_quantity: 0, total_price: 0 });
    } catch (error) {
      throw error;
    }
  };

  const value: CartContextType = {
    cartItems,
    cartSummary,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
