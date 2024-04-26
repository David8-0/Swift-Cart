const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a product must have name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  category:{
    type:String,
    required: [true, "category is required"],
    enum:["Electronics","Food","Jewelry","Games","Fashion","Sports","other"]
  },
  brand:String,
  price: {
    type: Number,
    Required: [true, 'a product must have price'],
  },
  priceDiscount: Number,
  description: String,
  imgCover: {
    type: String
  },
  images: [String],
  creationDate: {
    type: Date,
    default: Date.now(),
  },
  productSales: {
    type: Number,
    default: 0,
  },
  productQuantity: {
    type: Number,
    default: 1,
  },
  category: String,
});

module.exports = productModel = mongoose.model('product', productSchema);
