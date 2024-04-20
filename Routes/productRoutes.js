const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();
const authController = require('./../controllers/authController');


router.route('/top-selling-products')
.get(authController.protect,
    authController.restrictTo('seller'),
    productController.topSellingAlias,
    productController.getProducts);

router.route('/stats')
.get(authController.protect,
    authController.restrictTo('seller'),
    productController.getStatus);

router.route('/')
.post(authController.protect,
    authController.restrictTo('seller'),
    productController.createProduct)
.get(productController.getProducts);

router.route('/:id')
.get(productController.getProduct)
.patch(authController.protect,
    authController.restrictTo('seller'),
    productController.uploadProductImages,
    productController.resizeImages,
    productController.updateProduct)

.delete(authController.protect,
    authController.restrictTo('seller'),
    productController.deleteProductById);

router.route('/seller/:id')
.get(authController.protect,
    authController.restrictTo('seller'),
    productController.getSellerProducts)

module.exports = router;