const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();


router.route('/top-selling-products').get(productController.topSellingAlias,productController.getProducts);

router.route('/stats').get(productController.getStatus);
router.route('/')
.post(productController.createProduct)
.get(productController.getProducts);

router.route('/:id')
.get(productController.getProduct)
.patch(productController.updateProduct)
.delete(productController.deleteProductById);

module.exports = router;