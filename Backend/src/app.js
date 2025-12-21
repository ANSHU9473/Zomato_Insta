const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const foodRoutes = require("./routes/food.routes");

const app = express();

// ✅ Allowed origins (ADD VERCEL HERE)
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://zomato-insta-mu.vercel.app'
];

// ✅ CORS — MUST BE FIRST
app.use(cors({
    origin: function (origin, callback) {
        // allow Postman / server-to-server requests
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // ❌ reject silently (important)
        return callback(null, false);
    },
    credentials: true
}));

// ✅ Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);

// ✅ Test route
app.get("/", (req, res) => {
    res.send("hello world");
});

module.exports = app;
