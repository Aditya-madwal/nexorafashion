const Cart = require('../models/cart');
const Product = require('../models/product');

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId, qty } = req.body;

        if (!productId || !qty) {
            return res.status(400).json({ message: 'productId and qty are required' });
        }

        if (qty <= 0) {
            return res.status(400).json({ message: 'Quantity must be greater than 0' });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if item already exists in cart for this user
        const existingCartItem = await Cart.findOne({
            userId,
            productId
        });

        if (existingCartItem) {
            // Update quantity
            existingCartItem.quantity += qty;
            await existingCartItem.save();
            return res.status(200).json({
                message: 'Cart item updated',
                cartItem: existingCartItem
            });
        }

        // Create new cart item
        const cartItem = new Cart({
            userId,
            productId,
            quantity: qty
        });

        await cartItem.save();
        await cartItem.populate('productId', 'name price');

        res.status(201).json({
            message: 'Item added to cart',
            cartItem
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all cart items with total
const getCart = async (req, res) => {
    try {
        const userId = req.userId;

        // Get all cart items for the user
        const cartItems = await Cart.find({ userId })
            .populate('productId', 'name price description stock');

        // Calculate total
        let total = 0;
        const items = cartItems.map(item => {
            const product = item.productId;
            const itemTotal = product.price * item.quantity;
            total += itemTotal;

            return {
                id: item._id,
                product: {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    stock: product.stock
                },
                quantity: item.quantity,
                subtotal: itemTotal,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            };
        });

        res.json({
            items,
            total: parseFloat(total.toFixed(2)),
            itemCount: cartItems.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.userId;
        const cartItemId = req.params.id;

        // Find and verify the cart item belongs to the user
        const cartItem = await Cart.findOne({
            _id: cartItemId,
            userId
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        await Cart.deleteOne({ _id: cartItemId });

        res.json({
            message: 'Item removed from cart',
            deletedItem: cartItem
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart
};

