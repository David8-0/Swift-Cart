const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    products:[
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'product'
        }
    ],
    date:{
        type:Date,
        default: Date.now()
    },
    totalPrice:Number
});

const getTotalPrice = (arr) => {
    return  arr.reduce((total,item)=>total + (item.price*item.productQuantity),0);
  }

  orderSchema.pre(/^find/, async function(next){
    this.populate('products').populate('user');
    next();
  })


module.exports = orderModel = mongoose.model('order',orderSchema);