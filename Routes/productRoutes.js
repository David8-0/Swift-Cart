const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();
const authController = require('./../controllers/authController')


router.route('/top-selling-products').get(productController.topSellingAlias,productController.getProducts);

router.route('/stats').get(productController.getStatus);

router.route('/')
.post(authController.protect,authController.restrictTo('seller'),productController.createProduct)
.get(authController.protect,productController.getProducts);

router.route('/:id')
.get(productController.getProduct)
.patch(authController.protect,authController.restrictTo('seller'),productController.updateProduct)
.delete(authController.protect,authController.restrictTo('seller'),productController.deleteProductById);

module.exports = router;