const userModel = require('../models/user.model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const foodPartnerModel = require("../models/foodpartener.model");

// ------------------------ USER REGISTER ------------------------
async function registerUser(req, res) {
    const { name, email, password } = req.body;

    const isUserexists = await userModel.findOne({ email });
    if (isUserexists) {
        return res.status(400).json({ message: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({ name, email, password: hashedPassword });

    const token1 = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token1", token1);

    res.status(201).json({
        message: "user created",
        user: { _id: user._id, email: user.email, name: user.name }
    });
}

// ------------------------ USER LOGIN ------------------------
async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) return res.status(400).json({ message: "Invalid email or password" });

    const token1 = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token1", token1);

    return res.status(200).json({
        message: "User logged in Successfully",
        user: { _id: user._id, email: user.email, name: user.name }
    });
}

// ------------------------ USER LOGOUT ------------------------
async function logoutUser(req, res) {
    res.clearCookie("token1");
    res.status(200).json({ message: "User logged out" });
}

// ------------------------ FOOD PARTNER REGISTER ------------------------
async function registerFoodPartener(req, res) {
    try {
        const { name, RestaurantName, email, password, phone, contactName } = req.body;
        const restaurant = RestaurantName || name;

        const isAccountExists = await foodPartnerModel.findOne({ email });
        if (isAccountExists) {
            return res.status(400).json({ message: "Food Partner already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // create using the schema's RestaurantName field
        const foodPartener = await foodPartnerModel.create({
            RestaurantName: restaurant,
            contactName,
            email,
            password: hashedPassword,
            phone
        });

        const token2 = jwt.sign({ id: foodPartener._id }, process.env.JWT_SECRET);
        res.cookie("token2", token2);

        res.status(201).json({
            message: "Food partner registered",
            foodPartener: {
                _id: foodPartener._id,
                email: foodPartener.email,
                RestaurantName: foodPartener.RestaurantName,
                phone: foodPartener.phone,
                contactName: foodPartener.contactName
            }
        });
    } catch (err) {
        console.error('registerFoodPartener error:', err);
        // handle mongoose validation/duplicate key errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Duplicate field error', details: err.keyValue });
        }
        return res.status(500).json({ message: 'Server error' });
    }
}

// ------------------------ FOOD PARTNER LOGIN ------------------------
async function loginFoodPartener(req, res) {
    const { email, password } = req.body;

    const foodPartener = await foodPartnerModel.findOne({ email });
    if (!foodPartener) return res.status(400).json({ message: "Invalid email or password" });

    const isPassword = await bcrypt.compare(password, foodPartener.password);
    if (!isPassword) return res.status(400).json({ message: "Invalid email or password" });

    const token2 = jwt.sign({ id: foodPartener._id }, process.env.JWT_SECRET);
    res.cookie("token2", token2);

    res.status(200).json({
        message: "Food partner logged in",
        foodPartener: {
            _id: foodPartener._id,
            email: foodPartener.email,
            name: foodPartener.name
        }
    });
}

// ------------------------ FOOD PARTNER LOGOUT ------------------------
function logoutFoodPartener(req, res) {
    res.clearCookie("token2");
    res.status(200).json({ message: "Food Partner logged out" });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartener,
    loginFoodPartener,
    logoutFoodPartener
};

// ------------------------ GET FOOD PARTNER PROFILE (public) ------------------------
async function getFoodPartnerProfile(req, res) {
    try {
        const id = req.params.id;
        const partner = await foodPartnerModel.findById(id).select('-password');
        if (!partner) return res.status(404).json({ message: 'Food partner not found' });
        return res.status(200).json({ foodPartner: partner });
    } catch (err) {
        console.error('getFoodPartnerProfile error:', err.message);
        return res.status(500).json({ message: 'Server error' });
    }
}

// attach to exports
module.exports.getFoodPartnerProfile = getFoodPartnerProfile;

// ------------------------ GET CURRENT AUTHENTICATED FOOD PARTNER ------------------------
async function getCurrentFoodPartner(req, res) {
    try {
        // authFoodPartnerMiddleware sets req.foodPartner
        if (!req.foodPartner) return res.status(401).json({ message: 'Not authenticated' })
        const partner = req.foodPartner.toObject()
        delete partner.password
        return res.status(200).json({ foodPartener: partner })
    } catch (err) {
        console.error('getCurrentFoodPartner error:', err.message)
        return res.status(500).json({ message: 'Server error' })
    }
}

module.exports.getCurrentFoodPartner = getCurrentFoodPartner;

// ------------------------ GET CURRENT AUTHENTICATED USER ------------------------
async function getCurrentUser(req, res) {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authenticated' })
        const user = req.user.toObject()
        delete user.password
        return res.status(200).json({ user })
    } catch (err) {
        console.error('getCurrentUser error:', err.message)
        return res.status(500).json({ message: 'Server error' })
    }
}

module.exports.getCurrentUser = getCurrentUser;
