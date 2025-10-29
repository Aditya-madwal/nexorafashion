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
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="text-3xl font-bold text-gray-900">
              <span className="text-green-600">Nexora</span>Fashion
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Shopping
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <div className="flex-1 h-0.5 bg-gradient-to-r from-green-600 to-transparent rounded-full"></div>
        </div>

        {cartData && cartData.items && cartData.items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-5">
              {cartData.items.map((item) => {
                const CartItemImage = ({ imageUrl, productName }) => {
                  const [imageError, setImageError] = useState(false);
                  const [imageLoaded, setImageLoaded] = useState(false);
                  const hasValidImage = imageUrl && imageUrl.trim() !== "";

                  return (
                    <>
                      {hasValidImage && !imageError && (
                        <img
                          src={imageUrl}
                          alt={productName}
                          className="w-full h-full object-cover"
                          onLoad={() => setImageLoaded(true)}
                          onError={() => setImageError(true)}
                          style={{ display: imageLoaded ? "block" : "none" }}
                        />
                      )}
                      {(!imageLoaded || imageError || !hasValidImage) && (
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                          {!imageLoaded && hasValidImage && !imageError ? (
                            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                          ) : (
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
                          )}
                        </div>
                      )}
                    </>
                  );
                };

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-full sm:w-40 h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                      <CartItemImage
                        imageUrl={item.product.image}
                        productName={item.product.name}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {item.product.name}
                          </h3>
                          {item.product.description && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {item.product.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="space-y-1">
                          <p className="text-gray-700 text-sm font-medium">
                            Price:{" "}
                            <span className="font-bold text-gray-900">
                              ₹{item.product.price.toFixed(2)}
                            </span>
                          </p>
                          <p className="text-gray-700 text-sm font-medium">
                            Quantity:{" "}
                            <span className="font-bold text-gray-900">
                              {item.quantity}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900 mb-3">
                            ₹{item.subtotal.toFixed(2)}
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Stock Warning */}
                      {item.product.stock < item.quantity && (
                        <div className="mt-auto p-3 bg-orange-50 border border-orange-200 rounded-xl">
                          <p className="text-orange-800 text-xs font-medium flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Only {item.product.stock} available in stock
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-28">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 font-medium">
                      Items ({cartData.itemCount})
                    </span>
                    <span className="text-gray-900 font-bold">
                      ₹{cartData.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 font-medium">Shipping</span>
                    <span className="text-green-600 font-bold">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{cartData.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-gray-800 text-white py-4 px-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-colors mb-4">
                  Proceed to Checkout
                </button>

                <Link
                  to="/"
                  className="block text-center text-gray-700 hover:text-gray-900 mt-4 font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-16 h-16 text-gray-400"
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
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/"
              className="inline-block bg-gray-800 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-900 transition-colors">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
