const express=require('express');
const authController=require("../controllers/auth.controller");

const router=express.Router();

router.post('/user/register',authController.registerUser);
router.post('/user/login',authController.loginUser);
router.get('/user/logout',authController.logoutUser);
// get current authenticated user
const { authUserMiddleware } = require('../middlewares/auth.middleware');
router.get('/user/me', authUserMiddleware, authController.getCurrentUser);

router.post('/foodpartner/register',authController.registerFoodPartener);
router.post('/foodpartner/login',authController.loginFoodPartener);
router.get('/foodpartner/logout',authController.logoutFoodPartener);
// current authenticated partner
const { authFoodPartnerMiddleware } = require('../middlewares/auth.middleware');
router.get('/foodpartner/me', authFoodPartnerMiddleware, authController.getCurrentFoodPartner);
// Public: get food partner profile by id
router.get('/foodpartner/:id', authController.getFoodPartnerProfile);
module.exports=router;