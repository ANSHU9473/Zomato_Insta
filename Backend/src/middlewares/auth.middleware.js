// src/middlewares/auth.middleware.js
const foodPartenerModel = require("../models/foodpartener.model");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

// 🔐 FOOD PARTNER AUTH
async function authFoodPartnerMiddleware(req, res, next) {
    try {
        const token2 = req.cookies.token2;

        if (!token2) {
            return res.status(401).json({ message: "Please login as food partner" });
        }

        const decoded = jwt.verify(token2, process.env.JWT_SECRET);

        const foodPartner = await foodPartenerModel.findById(decoded.id);
        if (!foodPartner) {
            return res.status(401).json({ message: "Invalid partner token" });
        }

        // ⭐ THIS is the key line:
        req.foodPartner = foodPartner;

        console.log("✅ authFoodPartnerMiddleware set req.foodPartner:", foodPartner._id);
        next();
    } catch (err) {
        console.error("authFoodPartnerMiddleware error:", err.message);
        return res.status(401).json({ message: "Invalid token" });
    }
}

// 🔐 USER AUTH (unchanged)
async function authUserMiddleware(req, res, next) {
    try {
        const token1 = req.cookies.token1;

        if (!token1) {
            return res.status(401).json({ message: "Please login first" });
        }

        const decoded = jwt.verify(token1, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("authUserMiddleware error:", err.message);
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware,
};
