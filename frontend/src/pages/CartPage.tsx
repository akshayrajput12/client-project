import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';

const CartPage: React.FC = () => {
  const { cartItems, cartSummary, isLoading, updateCartItem, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary mb-4">Shopping Cart</h1>
            <p className="text-text-primary opacity-70 mb-4">Please log in to view your cart.</p>
            <Link
              to="/login"
              className="bg-primary-teal text-white px-6 py-2 rounded-md hover:bg-secondary-teal"
            >
              Log In
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, { quantity: newQuantity });
    } catch (error) {
      console.error('Failed to update cart item:', error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary mb-4">Shopping Cart</h1>
            <p className="text-text-primary opacity-70 mb-4">Your cart is empty.</p>
            <Link
              to="/"
              className="bg-primary-teal text-white px-6 py-2 rounded-md hover:bg-secondary-teal"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          className="text-error hover:text-error text-sm"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-primary-bg border border-secondary-bg rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    {item.product?.main_image_url ? (
                      <img
                        src={item.product.main_image_url}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-secondary-bg rounded-md flex items-center justify-center">
                        <span className="text-text-primary opacity-60 text-xs">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-text-primary truncate">
                      {item.product?.name}
                    </h3>
                    <p className="text-sm text-text-primary opacity-60">{item.product?.category}</p>
                    <p className="text-sm text-text-primary opacity-60">{item.product?.license}</p>
                  </div>

                  {/* Price */}
                  {/* <div className="text-right">
                    <div className="text-lg font-medium text-gray-900">
                      ${typeof item.product?.price === 'number' ? item.product.price.toFixed(2) : '0.00'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Total: ${typeof item.product?.price === 'number' ? (item.product.price * item.quantity).toFixed(2) : '0.00'}
                    </div>
                  </div> */}

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-secondary-bg flex items-center justify-center hover:bg-secondary-bg text-text-primary"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-text-primary">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-secondary-bg flex items-center justify-center hover:bg-secondary-bg text-text-primary"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-error hover:text-error p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-secondary-bg border border-secondary-bg rounded-lg p-6 sticky top-4">
            <h2 className="text-lg font-medium text-text-primary mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-text-primary">
                <span>Items ({cartSummary.total_items})</span>
                <span>${typeof cartSummary.total_price === 'number' ? cartSummary.total_price.toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm text-text-primary">
                <span>Total Quantity</span>
                <span>{cartSummary.total_quantity}</span>
              </div>
            </div>

            <div className="border-t border-primary-teal pt-4 mb-6">
              <div className="flex justify-between text-lg font-medium text-text-primary">
                <span>Total</span>
                <span>${typeof cartSummary.total_price === 'number' ? cartSummary.total_price.toFixed(2) : '0.00'}</span>
              </div>
            </div>

            <button className="w-full bg-primary-teal text-white py-3 px-4 rounded-md hover:bg-secondary-teal font-medium">
              Proceed to Checkout
            </button>

            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-primary-teal hover:text-secondary-teal text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default CartPage;
