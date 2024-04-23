const express = require('express');
const cartController = require('./../controllers/cartController')
const authController = require('./../controllers/authController')


const router = express.Router();




router.route('/')
.get(authController.protect,cartController.getMyCart)
.post(authController.protect,cartController.addToMyCart)
.delete(authController.protect,cartController.clearMyCart)
.patch(authController.protect,cartController.removeFromMyCart)
.put(authController.protect,cartController.deleteFromMyCart)
module.exports = router;