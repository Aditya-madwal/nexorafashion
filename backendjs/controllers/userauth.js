const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../utils/jwtutils');
const authenticateToken = require('../utils/authMiddleware');
const jwt = require('jsonwebtoken');

// User registration
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.status(201).json(userResponse);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// User logout
const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};

// User login
const login = async (req, res) => {
    try {
        let user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30s' });
        console.log('Token created:', token); // Debug log

        res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 24 });
        res.json({
            message: 'Login successful',
            token: token,  // Send token in response for debugging
            user: user
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get current user's data
const showMe = async (req, res) => {
    try {
        // Get user ID from the authenticated request
        const userId = req.userId;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user data without sensitive information
        const userData = {
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.json(userData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userInfo = {
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.json(userInfo);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Protected route example
const protectedRoute = (req, res) => {
    console.log(req.userId); // This will be the user's ID from the token
    res.status(200).json({ message: 'Access granted to protected route' });
};

module.exports = {
    register,
    login,
    logout,
    getUserProfile,
    protectedRoute,
    showMe
};
