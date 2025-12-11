const express=require('express');
const authController=require("../controllers/auth.controller");

const router=express.Router();

router.post('/user/register',authController.registerUser);
router.post('/user/login',authController.loginUser);
router.get('/user/logout',authController.logoutUser);

router.post('/foodpartner/register',authController.registerFoodPartener);
router.post('/foodpartner/login',authController.loginFoodPartener);
router.get('/foodpartner/logout',authController.logoutFoodPartener);
// Public: get food partner profile by id
router.get('/foodpartner/:id', authController.getFoodPartnerProfile);
module.exports=router;