const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const productModel = require('./productModel');
const { log } = require('console');


const userScehma = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user name is required'],
  },
  role:{
    type:String,
    required: [true, "role name is required"],
    enum:["seller","user"]
  },
  email: {
    type: String,
    required: [true, 'user email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'invalid email'],
  },
  password: {
    type: String,
    required: [true, 'user password is required'],
    minlength: 8,
    select:false
  },
  confirmPassword: {
    type: String,
    required: [true, 'user confirm password is required'],
    minlength: 8,
  },
  phone: {
    type: String,
  },
  Age: {
    type: Number,
    min: 12,
  },
  img: {
    type: String,
    default:'default.jpg'
  },
  passwordResetToken:String,
  passwordResetTokenExpire:Date,
  address:String,
  city:String,
//~ relationships
  sellerProducts:[
    {
      type:mongoose.Schema.ObjectId,
      ref:'product'
    }
  ],
  favorites:Array,
  cart:{
    totalPrice:{
      type:Number,
      default:0
    },
    products:Array,
  }
});

//~ Middlwares

//*hashing password
userScehma.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 8);
  this.confirmPassword = undefined;
  next();
});

//* populating seller producst on any search for user
userScehma.pre(/^find/,async function (next) {
  this.populate('sellerProducts');
  next();
});

//************************************************************** */
//* cart  handling

const getTotalPrice = (arr) => {
  return  arr.reduce((total,item)=>total + (item.price*item.productQuantity),0);
}

userScehma.methods.addToCart= async function(productid){
  let product =await productModel.findById(productid); 
  const productExist = await this.cart.products.find(doc => doc._id.equals(productid));
  if(productExist){
    productExist.productQuantity++;
  }else{
    this.cart.products.push(product);
  }
  this.cart.totalPrice= getTotalPrice(this.cart.products);
  this.markModified('cart');
  this.save({validateBeforeSave:false});
}
userScehma.methods.removeFromCart = async function(productid){
  const productExist = await this.cart.products.find(doc => doc._id.equals(productid));
  if(!productExist) throw new Error("product doesn't exist in cart");
    productExist.productQuantity--;
    if(productExist.productQuantity == 0 ) {
      const productExistIndex = this.cart.products.findIndex(doc => doc._id.equals(productid));
      this.cart.products.splice(productExistIndex, 1);
    }
    this.cart.totalPrice= getTotalPrice(this.cart.products);
    this.markModified('cart');
    this.save({validateBeforeSave:false});
}
userScehma.methods.deleteFromCart = async function(productid){
  const productExist = await this.cart.products.find(doc => doc._id.equals(productid));
  if(!productExist) throw new Error("product doesn't exist in cart");
  const productExistIndex = this.cart.products.findIndex(doc => doc._id.equals(productid));
      this.cart.products.splice(productExistIndex, 1);
      this.cart.totalPrice= getTotalPrice(this.cart.products);
    this.markModified('cart');
    this.save({validateBeforeSave:false});
}
//************************************************************** */
//& favorites handling

userScehma.methods.addToFav= async function (productid){
  let product =await productModel.findById(productid);
  const productExist = await this.favorites.find(doc => doc._id.equals(productid));
  if(productExist) throw new Error('product already exists in your favorites');
  this.favorites.push(product);
  this.save({validateBeforeSave:false});
}
userScehma.methods.removeFromFav= async function (productid){
  const productExist = await this.favorites.find(doc => doc._id.equals(productid));
  if(!productExist) throw new Error('product does not exists in your favorites');
  const productExistIndex = this.favorites.findIndex(doc => doc._id.equals(productid));
  this.favorites.splice(productExistIndex, 1);
  this.save({validateBeforeSave:false});
}
//************************************************************** */
//! authentication handling
userScehma.methods.correctPassword = async (candidatePassword,userPasswords) => {
    try{
      //console.log(`oldpassword ${candidatePassword}`);
      //console.log(`has password ${userPasswords}`); //* msh berg3 b hashed password
      const result =await bcrypt.compare(candidatePassword, userPasswords);
      //console.log(result);
      return result
    }catch(err){
      console.log(err);
      return false;
    }
}
userScehma.methods.createResetToken=function(){
    const resetToken = crypto.randomBytes(16).toString('hex');
    this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

module.exports = userModel = mongoose.model('User', userScehma);
