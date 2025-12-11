const express = require('express');
const router = express.Router();

const { 
    authFoodPartnerMiddleware,
    authUserMiddleware 
} = require("../middlewares/auth.middleware");

const foodController = require("../controllers/food.controller");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });


// Partner uploads food
router.post(
    "/",
    authFoodPartnerMiddleware,
    upload.single("video"),
    foodController.createFood
);

// Users get food items
router.get(
    "/",
    // Public endpoint: do not require user auth so the app (Reels) can fetch items
    foodController.getFoodItems
);

module.exports = router;
