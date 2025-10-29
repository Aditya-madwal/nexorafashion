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

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts({ page: 1, limit: 20 });
      setProducts(response.products || []);
      setFilteredProducts(response.products || []);

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
    // Navigate to logout or show profile menu
    navigate("/logout");
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

  // Split products into similar items and recently viewed (for demo, we'll use the same products)
  const similarItems = filteredProducts.slice(0, 4);
  const recentlyViewed = filteredProducts.slice(4, 8);

  const ProductCard = ({ product }) => {
    const qty = quantities[product._id] || 1;

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative flex flex-col">
        {/* Heart Icon */}
        <button className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
          <svg
            className="w-5 h-5 text-gray-600"
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
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x300?text=No+Image";
              }}
            />
          ) : (
            <div className="text-gray-400 text-sm">No Image</div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Name and Price */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-900 flex-1 pr-2">
              {product.name}
            </h3>
            <span className="font-bold text-lg text-gray-900 whitespace-nowrap">
              ${product.price?.toFixed(2) || "0.00"}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-500 text-sm mb-2 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Stock */}
          <p className="text-gray-600 text-xs mb-2">
            Stock:{" "}
            <span
              className={
                product.stock > 0
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }>
              {product.stock > 0
                ? `${product.stock} available`
                : "Out of stock"}
            </span>
          </p>

          {/* Posted At */}
          <p className="text-gray-500 text-xs mb-3">
            Posted: {formatDate(product.createdAt)}
          </p>

          {/* Rating - Static for now */}
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-500 text-xs ml-1">(121)</span>
          </div>

          {/* Quantity Selector and Add to Cart */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => handleQuantityChange(product._id, -1)}
                  className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  disabled={qty <= 1}>
                  −
                </button>
                <span className="px-3 py-1 text-sm font-medium border-x border-gray-300">
                  {qty}
                </span>
                <button
                  onClick={() => handleQuantityChange(product._id, 1)}
                  className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  disabled={product.stock > 0 && qty >= product.stock}>
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => handleAddToCart(product)}
              disabled={product.stock === 0}
              className="w-full py-2 px-4 border border-black rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm">
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Company Name */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">ShopHub</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
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

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors mr-2">
              <svg
                className="w-6 h-6 text-gray-600"
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

            {/* Profile Button */}
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="text-gray-700 font-medium hidden sm:block">
                {me?.username || "Profile"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-gray-500">Loading products...</div>
          </div>
        ) : (
          <>
            {/* Similar Items You Might Like */}
            {similarItems.length > 0 && (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Similar Items You Might Like
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {similarItems.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Recently Viewed
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recentlyViewed.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Show message if no products found */}
            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
