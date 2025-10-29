import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCart } from "../services/cartapi";
import { processCheckout } from "../services/checkoutapi";
import toast from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      if (!response.items || response.items.length === 0) {
        toast.error("Your cart is empty");
        navigate("/cart");
        return;
      }
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

  const handleCheckout = async () => {
    try {
      setProcessing(true);
      const response = await processCheckout();
      setReceipt(response.receipt);
      toast.success("Checkout successful!");

      // // Clear cart data after successful checkout
      // setTimeout(() => {
      //   navigate("/");
      // }, 5000);
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error(error.response?.data?.message || "Checkout failed");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading checkout...</div>
      </div>
    );
  }

  if (receipt) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-2xl font-bold text-gray-900">
                ShopHub
              </Link>
            </div>
          </div>
        </nav>

        {/* Receipt */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order Successful!
              </h1>
              <p className="text-gray-600">
                Thank you for your purchase. Your order has been confirmed.
              </p>
            </div>

            <div className="border-t border-b py-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Receipt ID</span>
                <span className="font-mono font-semibold text-gray-900">
                  {receipt.receiptId}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Date</span>
                <span className="text-gray-900">
                  {formatDate(receipt.timestamp)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  {receipt.status}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Details
              </h2>
              <div className="space-y-3">
                {receipt.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.productName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${receipt.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                <span>Payment Method</span>
                <span>{receipt.paymentMethod}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 text-center">
                A confirmation email has been sent to your registered email
                address.
              </p>
            </div>

            <Link
              to="/"
              className="block w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center">
              Continue Shopping
            </Link>

            <p className="text-center text-sm text-gray-500 mt-4">
              You will be redirected automatically in a few seconds...
            </p>
          </div>
        </div>
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
              to="/cart"
              className="text-gray-700 hover:text-gray-900 font-medium">
              ← Back to Cart
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {cartData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cartData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center pb-4 border-b">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × $
                        {item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2 text-gray-600">
                  <span>Subtotal</span>
                  <span>${cartData.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2 text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>${cartData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Payment Information
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  This is a mock checkout. No actual payment will be processed.
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500">
                      <option>Credit Card</option>
                      <option>Debit Card</option>
                      <option>PayPal</option>
                      <option>Bank Transfer</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={
                    processing || !cartData || cartData.items.length === 0
                  }
                  className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {processing ? "Processing..." : "Complete Order"}
                </button>

                <Link
                  to="/cart"
                  className="block text-center text-gray-600 hover:text-gray-900 mt-4 font-medium">
                  ← Modify Cart
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
