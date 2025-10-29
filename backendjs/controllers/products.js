const Product = require('../models/product');

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, image } = req.body;

        // Validation
        if (!name || price === undefined) {
            return res.status(400).json({ message: 'Name and price are required' });
        }

        if (price < 0) {
            return res.status(400).json({ message: 'Price must be greater than or equal to 0' });
        }

        if (stock !== undefined && stock < 0) {
            return res.status(400).json({ message: 'Stock must be greater than or equal to 0' });
        }

        // Create new product
        const product = new Product({
            name,
            description: description || '',
            price,
            stock: stock !== undefined ? stock : 0,
            image: image || ''
        });

        await product.save();

        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get products with pagination
const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total count for pagination metadata
        const total = await Product.countDocuments();

        // Get products with pagination
        const products = await Product.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalPages = Math.ceil(total / limit);

        res.json({
            products,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: total,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createProduct,
    getProducts
};

