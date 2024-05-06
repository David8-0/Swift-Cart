const express = require('express');
const orderController = require('./../controllers/orderController');
const authController = require('./../controllers/authController');
const router = express.Router();


router.route('/')
.get(authController.protect,orderController.getAllOrders)
.post(authController.protect,orderController.createOrder)
.get(authController.protect,orderController.getUserOrders)
// .patch(authController.protect,orderController.updateOrder);





module.exports = router;