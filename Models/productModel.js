const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a product must have name'],
    unique: true,
  },
  rating:{
    type:Number,
    default:0
  },
  price:{
    type:Number,
    Required: [true, 'a product must have price']
  },
  priceDiscount:Number,
  description: String,
  imgCover: {
    type:String,
    required: [true, 'a product must have image cover']
  },
  imageCover:String,
  images:[String],
  creationDate: {
    type:Date,
    default: Date.now()
  },
  productSales:{
    type:Number,
    default: 0
  },
  productQuantity:{
    type:Number,
    default: 1
  }
});


module.exports = productModel = mongoose.model('product',productSchema);
