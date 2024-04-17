const express = require('express');
const tourController= require('../controllers/tourController');


const router = express.Router();
router.param('id',tourController.checkID)
router.route('/').get(tourController.getAllTours).post(tourController.checkForTourInfo,tourController.addNewTour);
router.route('/:id').get(tourController.getTourById);


  module.exports = router