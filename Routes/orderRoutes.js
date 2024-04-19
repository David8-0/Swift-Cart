const express = require('express');
const orderController = require('./../controllers/orderController');
const authController = require('./../controllers/authController');
const router = express.Router();


router.route('/')
.get(authController.protect,orderController.getAllOrders)
// .patch(authController.protect,orderController.updateOrder);

router.route('/:id')
.get(authController.protect,orderController.getUserOrders)
.post(authController.protect,orderController.createOrder)

module.exports = router;