const express = require('express');
const authController = require('./../controllers/authController')
const favoritesController = require('./../controllers/favoritesController')

const router = express.Router();




router.route('/')
.get(authController.protect,favoritesController.getMyFavorites)
.post(authController.protect,favoritesController.addToMyFavorites)
.delete(authController.protect,favoritesController.clearMyFavorites)
.patch(authController.protect,favoritesController.removeFromMyFavorites)

module.exports = router;