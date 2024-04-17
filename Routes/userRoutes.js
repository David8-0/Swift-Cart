const express = require('express');
const userController = require('../controllers/userController')
const authController = require('./../controllers/authController');
const router = express.Router();


router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:resetToken').post(authController.resetPassword);

router.route('/').get(userController.getAllUsers).post(userController.addNewUser);
router
  .route('/:id')
  .get(userController.getuser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);




  module.exports =router;