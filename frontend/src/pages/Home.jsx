import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MyContext } from "../MyContext";
import { getProducts } from "../services/productapi";
import { addToCart } from "../services/cartapi";
import toast from "react-hot-toast";

const Home = () => {
  const { me } = useContext(MyContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "" && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getProducts({ page, limit: 5 });
      setProducts(response.products || []);
      setFilteredProducts(response.products || []);
      setPagination(response.pagination || null);

      // Initialize quantities to 1 for all products
      const initialQuantities = {};
      (response.products || []).forEach((product) => {
        initialQuantities[product._id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuantityChange = (productId, change) => {
    setQuantities((prev) => {
      const currentQty = prev[productId] || 1;
      const newQty = Math.max(1, currentQty + change);
      return { ...prev, [productId]: newQty };
    });
  };

  const handleAddToCart = async (product) => {
    try {
      const qty = quantities[product._id] || 1;
      await addToCart({ productId: product._id, qty });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const handleProfileClick = () => {
    // Intentionally left empty to keep profile button static
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const ProductCard = ({ product }) => {
    const qty = quantities[product._id] || 1;
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const hasValidImage = product.image && product.image.trim() !== "";

    return (
      <div className="bg-white rounded-2xl overflow-hidden relative flex flex-col border border-gray-100">
        {/* Discount Tag */}
        <div className="absolute top-4 left-4 z-10 bg-black/80 text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          {product.discount || "10"}% OFF
        </div>

        {/* Heart Icon */}
        <button className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Product Image */}
        <div className="w-full h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative rounded-t-2xl">
          {hasValidImage && !imageError ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{ display: imageLoaded ? "block" : "none" }}
            />
          ) : null}
          {(imageError || !hasValidImage) && (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-20 h-20 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5 flex-1 flex flex-col bg-white">
          {/* Product Title */}
          <h3 className="font-semibold text-base text-gray-900 mb-2 line-clamp-2 leading-tight">
            {product.name}
          </h3>

          {/* Price and Rating */}
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-xl text-gray-900">
              ₹{product.price?.toFixed(2) || "0.00"}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-gray-900">4.4</span>
              <svg
                className="w-4 h-4 fill-orange-500 text-orange-500"
                viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            </div>
          </div>

          {/* Quantity Selector and Add to Cart Button */}
          <div className="flex items-center gap-3 mb-3">
            {/* Quantity Selector - Pill Shaped */}
            <div className="flex items-center bg-gray-50 rounded-full px-2 border border-gray-200">
              <button
                onClick={() => handleQuantityChange(product._id, -1)}
                className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-full disabled:opacity-50 transition-colors"
                disabled={qty <= 1}>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <span className="px-4 py-1.5 text-sm font-semibold text-gray-900 min-w-[2rem] text-center">
                {qty}
              </span>
              <button
                onClick={() => handleQuantityChange(product._id, 1)}
                className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-full disabled:opacity-50 transition-colors"
                disabled={product.stock > 0 && qty >= product.stock}>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => handleAddToCart(product)}
            disabled={product.stock === 0}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>{product.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Company Name */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-3xl font-bold text-gray-900">
                <span className="text-green-600">Nexora</span>Fashion
              </h1>
            </Link>

            {/* Search Bar - Enhanced */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all font-medium"
                />
                <svg
                  className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <Link
                to="/cart"
                className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors group">
                <svg
                  className="w-6 h-6 text-gray-700 group-hover:text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </Link>

              {/* Profile - Static */}
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 select-none">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {me?.username?.charAt(0).toUpperCase() || "P"}
                  </span>
                </div>
                <span className="text-gray-700 font-semibold hidden lg:block">
                  {me?.username || "Profile"}
                </span>
              </div>

              {/* Logout */}
              <Link
                to="/logout"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 text-white hover:bg-gray-900 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                  />
                </svg>
                <span className="font-semibold">Logout</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-gray-500 font-medium">Loading products...</div>
          </div>
        ) : (
          <>
            {/* Our Products */}
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-4xl font-bold text-gray-900">
                  Our Products
                </h2>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-green-600 to-transparent rounded-full"></div>
              </div>

              {filteredProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>

                  {/* Pagination - Only show when not searching */}
                  {pagination &&
                    pagination.totalPages > 1 &&
                    searchQuery.trim() === "" && (
                      <div className="flex items-center justify-center gap-2 mt-8">
                        {/* Previous Button */}
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={!pagination.hasPrevPage}
                          className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                          <svg
                            className="w-5 h-5 inline-block mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                          Previous
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-2">
                          {Array.from(
                            { length: pagination.totalPages },
                            (_, i) => i + 1
                          ).map((pageNum) => {
                            // Show first page, last page, current page, and pages around current
                            if (
                              pageNum === 1 ||
                              pageNum === pagination.totalPages ||
                              (pageNum >= currentPage - 1 &&
                                pageNum <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => handlePageChange(pageNum)}
                                  className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                                    currentPage === pageNum
                                      ? "bg-gray-800 text-white"
                                      : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                                  }`}>
                                  {pageNum}
                                </button>
                              );
                            } else if (
                              pageNum === currentPage - 2 ||
                              pageNum === currentPage + 2
                            ) {
                              return (
                                <span
                                  key={pageNum}
                                  className="px-2 text-gray-500">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}
                        </div>

                        {/* Next Button */}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={!pagination.hasNextPage}
                          className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                          Next
                          <svg
                            className="w-5 h-5 inline-block ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    )}

                  {/* Pagination Info - Only show when not searching */}
                  {pagination && searchQuery.trim() === "" && (
                    <div className="text-center text-gray-600 text-sm mt-4">
                      Showing {(currentPage - 1) * 5 + 1} to{" "}
                      {Math.min(currentPage * 5, pagination.totalItems)} of{" "}
                      {pagination.totalItems} products
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-xl font-medium">
                    No products found
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
