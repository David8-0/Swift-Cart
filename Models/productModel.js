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
  actualPrice:Number,
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
  amount: {
    type: Number,
    default: 0,
  },
  category: String,
});

productSchema.pre('save',function(next){
  if(this.priceDiscount>0){
    this.actualPrice = this.price - this.priceDiscount;

  }else{
    this.actualPrice = this.price;
  }
  this.markModified('actualPrice');
  //this.save({validateBeforeSave:false});
  next();
});

productSchema.methods.updateActualPrice=function() {
  if(this.priceDiscount>0){
    this.actualPrice = this.price - this.priceDiscount;

  }else{
    this.actualPrice = this.price;
  }
  this.markModified('actualPrice');
  console.log('accc');
  this.save({validateBeforeSave:false});
}




module.exports = productModel = mongoose.model('product', productSchema);
