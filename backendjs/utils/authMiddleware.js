const jwt = require('jsonwebtoken');
const { jwtDecode } = require("jwt-decode");
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const retrieved_token = req.headers.authorization;
    console.log(retrieved_token);
    if (!retrieved_token) {
        return res.status(401).json({ message: 'Unauthorized : No token provided' });
    }

    const [bearer, token] = retrieved_token.split(' ');
    if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Unauthorized : Invalid token format' });
    }

    try {
        // First, decode the token to check expiration
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        console.log(decodedToken.exp);
        console.log(currentTime);

        if (decodedToken.exp < currentTime) {
            return res.status(401).json({
                message: 'Unauthorized : Token has expired',
                expired: true
            });
        }

        // If not expired, verify the token signature
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verified.id;
        next();

    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ message: 'Unauthorized : Invalid token' });
    }
};

module.exports = authenticateToken;