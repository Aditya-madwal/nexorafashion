import api from "../api";

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password
 * @returns {Promise} Axios response with user data
 */
export const register = async ({ username, email, password }) => {
    const response = await api.post("/api/register", {
        username,
        email,
        password,
    });
    return response.data;
};

/**
 * Login user and get JWT token
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.username - Username
 * @param {string} credentials.password - Password
 * @returns {Promise} Axios response with token and user data
 */
export const login = async ({ username, password }) => {
    const response = await api.post("/api/login", {
        username,
        password,
    });
    return response.data;
};

/**
 * Logout user (clears cookie)
 * @returns {Promise} Axios response with logout message
 */
export const logout = async () => {
    const response = await api.get("/api/logout");
    return response.data;
};

/**
 * Get current authenticated user's profile
 * Requires authentication
 * @returns {Promise} Axios response with user profile data
 */
export const getCurrentUser = async () => {
    const response = await api.get("/api/showme");
    return response.data;
};

/**
 * Get user profile by username
 * Requires authentication
 * @param {string} username - Username to fetch
 * @returns {Promise} Axios response with user profile data
 */
export const getUserByUsername = async (username) => {
    const response = await api.get(`/api/user/${username}`);
    return response.data;
};

