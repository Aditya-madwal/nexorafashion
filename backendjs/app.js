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


app.get("/", async (req, res) => {
    res.send("welcome");
});

// auth apis
app.post('/api/register', userAuth.register);
app.post('/api/login', userAuth.login);
app.get('/api/logout', userAuth.logout);
app.get('/api/user/:username', authenticateToken, userAuth.getUserProfile);
app.get('/api/protected', authenticateToken, userAuth.protectedRoute);
app.get('/api/showme', authenticateToken, userAuth.showMe);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
