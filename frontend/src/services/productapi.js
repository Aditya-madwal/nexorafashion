import api from "../api";

/**
 * Create a new product
 * Requires authentication
 * @param {Object} productData - Product data
 * @param {string} productData.name - Product name (required)
 * @param {string} productData.description - Product description (optional)
 * @param {number} productData.price - Product price (required, min: 0)
 * @param {number} productData.stock - Product stock (optional, min: 0, default: 0)
 * @param {string} productData.image - Product image URL or path (optional)
 * @returns {Promise} Axios response with created product data
 */
export const createProduct = async ({ name, description, price, stock, image }) => {
    const response = await api.post("/api/products", {
        name,
        description,
        price,
        stock,
        image,
    });
    return response.data;
};

/**
 * Get paginated list of products
 * Authentication not required
 * @param {Object} params - Pagination parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @returns {Promise} Axios response with products and pagination info
 */
export const getProducts = async ({ page = 1, limit = 10 } = {}) => {
    const response = await api.get("/api/products", {
        params: {
            page,
            limit,
        },
    });
    return response.data;
};

