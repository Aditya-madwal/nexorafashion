const express = require("express");
const app = express();
const port = 8000;

const path = require("path");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const authenticateToken = require('./utils/authMiddleware');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(cors());

const userAuth = require('./controllers/userauth');
const products = require('./controllers/products');
const cart = require('./controllers/cart');
const checkout = require('./controllers/checkout');


app.get("/", async (req, res) => {
    res.send("welcome");
});

// auth apis
app.post('/api/register', userAuth.register);
app.post('/api/login', userAuth.login);
app.get('/api/user/:username', authenticateToken, userAuth.getUserProfile);
app.get('/api/protected', authenticateToken, userAuth.protectedRoute);
app.get('/api/showme', authenticateToken, userAuth.showMe);

// products apis
app.post('/api/products', authenticateToken, products.createProduct);
app.get('/api/products', products.getProducts);

// cart apis
app.post('/api/cart', authenticateToken, cart.addToCart);
app.get('/api/cart', authenticateToken, cart.getCart);
app.delete('/api/cart/:id', authenticateToken, cart.removeFromCart);

// checkout apis
app.post('/api/checkout', authenticateToken, checkout.checkout);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
