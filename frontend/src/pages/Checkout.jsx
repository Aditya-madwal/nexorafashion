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
        <div className="text-gray-600 text-lg font-medium">
          Loading checkout...
        </div>
      </div>
    );
  }

  if (receipt) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <span>
                <span className="text-3xl font-bold text-green-600">
                  Nexora
                </span>
                <span className="text-3xl font-bold text-gray-900">
                  Fashion
                </span>
              </span>
              <Link
                to="/"
                className="text-gray-700 hover:text-gray-900 font-medium text-base px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </nav>

        {/* Receipt */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-gray-200 p-10">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                Order Successful!
              </h1>
              <p className="text-gray-600 text-lg">
                Thank you for your purchase. Your order has been confirmed.
              </p>
            </div>

            <div className="border-t border-b border-gray-200 py-8 mb-8">
              <div className="flex justify-between items-center mb-5">
                <span className="text-gray-600 font-medium">Receipt ID</span>
                <span className="font-mono font-semibold text-gray-900 text-lg">
                  {receipt.receiptId}
                </span>
              </div>
              <div className="flex justify-between items-center mb-5">
                <span className="text-gray-600 font-medium">Date</span>
                <span className="text-gray-900 font-medium">
                  {formatDate(receipt.timestamp)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Status</span>
                <span className="px-4 py-1.5 bg-green-50 text-green-700 rounded-xl text-sm font-semibold">
                  {receipt.status}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
                Order Details
              </h2>
              <div className="space-y-4">
                {receipt.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">
                        {item.productName}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold text-gray-900 text-lg">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-8">
              <div className="flex justify-between items-center text-2xl font-bold text-gray-900 mb-3">
                <span>Total</span>
                <span>${receipt.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-base text-gray-600">
                <span className="font-medium">Payment Method</span>
                <span className="font-medium">{receipt.paymentMethod}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 mb-8">
              <p className="text-sm text-gray-600 text-center font-medium">
                A confirmation email has been sent to your registered email
                address.
              </p>
            </div>

            <Link
              to="/"
              className="block w-full bg-black text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-center text-base">
              Continue Shopping
            </Link>

            <p className="text-center text-sm text-gray-500 mt-6 font-medium">
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
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20 justify-between">
            {/* NexoraFashion at left */}
            <Link
              to="/"
              className="text-3xl font-bold text-gray-900 tracking-tight">
              <span>
                <span className="text-3xl font-bold text-green-600">
                  Nexora
                </span>
                Fashion
              </span>
            </Link>
            <div className="flex-1 flex items-center justify-end">
              <Link
                to="/cart"
                className="text-gray-700 hover:text-gray-900 font-medium text-base px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Checkout
          </h1>
          <p className="text-gray-600 text-lg">
            Review your order and complete your purchase
          </p>
        </div>

        {cartData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
                Order Summary
              </h2>

              <div className="space-y-5 mb-8">
                {cartData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center pb-5 border-b border-gray-100">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        Quantity: {item.quantity} × $
                        {item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold text-gray-900 text-lg">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-3 text-gray-700">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">
                    ${cartData.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4 text-gray-700">
                  <span className="font-medium">Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between items-center text-2xl font-bold text-gray-900 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>${cartData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 sticky top-28">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                  Payment Information
                </h2>
                <p className="text-sm text-gray-600 mb-8 font-medium">
                  This is a mock checkout. No actual payment will be processed.
                </p>

                <div className="space-y-5 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Payment Method
                    </label>
                    <select className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all">
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
                  className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base mb-4">
                  {processing ? "Processing..." : "Complete Order"}
                </button>

                <Link
                  to="/cart"
                  className="block text-center text-gray-600 hover:text-gray-900 mt-4 font-medium text-base">
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
