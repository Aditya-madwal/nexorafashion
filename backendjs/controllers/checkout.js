const Cart = require('../models/cart');
const Product = require('../models/product');

// Process checkout and return mock receipt
const checkout = async (req, res) => {
    try {
        const userId = req.userId;

        // Get all cart items for the user
        const cartItems = await Cart.find({ userId })
            .populate('productId', 'name price');

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total
        let total = 0;
        const items = cartItems.map(item => {
            const product = item.productId;
            const itemTotal = product.price * item.quantity;
            total += itemTotal;

            return {
                productName: product.name,
                quantity: item.quantity,
                unitPrice: product.price,
                subtotal: itemTotal
            };
        });

        // Create mock receipt
        const receipt = {
            receiptId: `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            timestamp: new Date().toISOString(),
            items,
            total: parseFloat(total.toFixed(2)),
            paymentMethod: 'Mock Payment',
            status: 'Completed'
        };

        // Clear the cart after checkout (optional - you may want to keep it for history)
        // await Cart.deleteMany({ userId });

        res.status(200).json({
            message: 'Checkout successful',
            receipt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    checkout
};

