import api from "../api";

/**
 * Add item to cart or update quantity if item already exists
 * Requires authentication
 * @param {Object} cartData - Cart item data
 * @param {string} cartData.productId - Product ID (MongoDB ObjectId)
 * @param {number} cartData.qty - Quantity (min: 1)
 * @returns {Promise} Axios response with cart item data
 */
export const addToCart = async ({ productId, qty }) => {
    const response = await api.post("/api/cart", {
        productId,
        qty,
    });
    return response.data;
};

/**
 * Get all items in user's cart with calculated totals
 * Requires authentication
 * @returns {Promise} Axios response with cart items, total, and item count
 */
export const getCart = async () => {
    const response = await api.get("/api/cart");
    return response.data;
};

/**
 * Remove item from cart
 * Requires authentication
 * @param {string} cartItemId - Cart item ID to remove
 * @returns {Promise} Axios response with deleted item data
 */
export const removeFromCart = async (cartItemId) => {
    const response = await api.delete(`/api/cart/${cartItemId}`);
    return response.data;
};

