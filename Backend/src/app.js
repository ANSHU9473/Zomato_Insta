const express = require('express');
const cookieParser = require('cookie-parser');

const authRoutes = require("./routes/auth.route");
const foodRoutes = require("./routes/food.routes");
const cors=require("cors");
const app = express();
// Allow frontend origins used in development (echo the incoming origin when allowed)
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174']
app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin (like curl, postman)
        if(!origin) return callback(null, true)
        if(allowedOrigins.indexOf(origin) !== -1){
            return callback(null, true)
        }
        return callback(new Error('CORS policy: Origin not allowed'))
    },
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
