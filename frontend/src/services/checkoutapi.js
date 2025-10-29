import api from "../api";

/**
 * Process checkout and generate receipt
 * Requires authentication
 * @returns {Promise} Axios response with checkout receipt data
 */
export const processCheckout = async () => {
    const response = await api.post("/api/checkout");
    return response.data;
};

