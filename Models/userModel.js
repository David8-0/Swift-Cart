const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const productModel = require('./productModel')


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
  img: String,
  passwordResetToken:String,
  passwordResetTokenExpire:Date,
//~ relationships
  sellerProducts:[
    {
      type:mongoose.Schema.ObjectId,
      ref:'product'
    }
  ],
  favorites:Array,
  cart:Array
});

userScehma.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 8);
  this.confirmPassword = undefined;
  next();
});
userScehma.pre(/^find/,async function (next) {
  this.populate('sellerProducts');
  next();
});

userScehma.pre('save', async function (next) {
   
  let cartPromise = this.cart.map( async id=> await productModel.findById(id));
  let favoritspromise=this.favorites.map( async id=> await productModel.findById(id));
  
  this.favorites =await Promise.all(favoritspromise);
  console.log(this.favorites);
  this.cart =await Promise.all(cartPromise);
  
  next();
})

userScehma.methods.addToCart= async (...productsid)=>{
  let products =await productsid.map(async (id)=> await productModel.findById(id));
  this.cart.push(products);
}

userScehma.methods.addToFav= async (...productsid)=>{
  let products =await productsid.map(async (id)=> await productModel.findById(id));
  this.favorites.push(products);
}

userScehma.methods.correctPassword = async (candidatePassword,userPasswords) => {
    return await bcrypt.compare(candidatePassword, userPasswords);
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
