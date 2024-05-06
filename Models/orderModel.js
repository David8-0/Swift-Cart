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
    totalPrice:Number,
    status:{
        type:String,
        enum:["Pending","Processing","Shipped","OutForDelivery","Delivered","Cancelled","Returned","Refunded"],
        default:"Pending"
    }
});



  orderSchema.pre(/^find/, async function(next){
    this.populate('products').populate('user');
    next();
  })


module.exports = orderModel = mongoose.model('order',orderSchema);