import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCart, removeFromCart } from "../services/cartapi";
import toast from "react-hot-toast";

const Cart = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      setCartData(response);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast.success("Item removed from cart");
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const handleProceedToCheckout = () => {
    if (cartData && cartData.items && cartData.items.length > 0) {
      navigate("/checkout");
    } else {
      toast.error("Your cart is empty");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              ShopHub
            </Link>
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 font-medium">
              ← Back to Shopping
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

        {cartData && cartData.items && cartData.items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartData.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row gap-4">
                  {/* Product Image Placeholder */}
                  <div className="w-full sm:w-32 h-32 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {item.product.name}
                        </h3>
                        {item.product.description && (
                          <p className="text-gray-600 text-sm mb-2">
                            {item.product.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">
                          Price: ${item.product.price.toFixed(2)}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900 mb-2">
                          ${item.subtotal.toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Stock Warning */}
                    {item.product.stock < item.quantity && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-yellow-800 text-xs">
                          ⚠️ Only {item.product.stock} available in stock
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({cartData.itemCount})</span>
                    <span>${cartData.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>${cartData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Proceed to Checkout
                </button>

                <Link
                  to="/"
                  className="block text-center text-gray-600 hover:text-gray-900 mt-4 font-medium">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-24 h-24 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/"
              className="inline-block bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
