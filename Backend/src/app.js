const express = require('express');
const cookieParser = require('cookie-parser');

const authRoutes = require("./routes/auth.route");
const foodRoutes = require("./routes/food.routes");
const cors=require("cors");
const app = express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

// 1️⃣ BASIC MIDDLEWARES FIRST
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2️⃣ ROUTES AFTER BODY PARSERS
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
    res.send("hello world");
});

module.exports = app;
