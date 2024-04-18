const express = require('express');
const userController = require('../controllers/userController')
const authController = require('./../controllers/authController');
const router = express.Router();


router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:resetToken').patch(authController.resetPassword);
router.route('/updatePassword').patch(authController.protect,authController.updatePassword);
router.route('/cart').post(authController.protect,userController.addToMyCart);
router.route('/favorites').post(authController.protect);


router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(authController.protect,userController.getuser)
  .patch(authController.protect,userController.updateUser)
  .delete(authController.protect,userController.deleteUser);




  module.exports =router;