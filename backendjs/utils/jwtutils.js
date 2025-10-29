const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/jwtconfig');

const generateToken = (userId) => {
    // here payload is the user id
    return jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, secretKey);
};

module.exports = {
    generateToken,
    verifyToken
};