const orderModel = require('./../Models/orderModel');
const userModel = require('./../Models/userModel');



exports.getAllOrders = async (req,res) => {
    try{
        const orders = await orderModel.find();
        res.status(200).json({
          status:'success',
          data:{
            orders
        }
        })  
      }catch(err){
          res.status(400).json({status:"fail",message: err.message});
      }
}

exports.createOrder = async (req,res) => {
    try{
        const userId = req.freshUser._id;
        const user = await userModel.findById(userId);
        if(!user) throw new Error("invalid user id");
        const newOrder = await orderModel.create({
            user:userId,
            products:user.cart.products,
            totalPrice:user.cart.totalPrice
        });
        user.cart.totalPrice=0;
        user.cart.products=[];
        await user.save({validateBeforeSave:false});
        res.status(200).json({
          status:'success',
          data:{
            newOrder
        }
        })  
      }catch(err){
          res.status(400).json({status:"fail",message: err.message});
      }
}

exports.getUserOrders = async (req,res)=>{
  
  try{
    const userId = req.freshUser._id;
    const user = await userModel.findById(userId);
    if(!user) throw new Error("invalid user id");
    const userOrders = await orderModel.find({user:user})
    res.status(200).json({
      status:'success',
      data:{
        userOrders
    }
    })  
  }catch(err){
      res.status(400).json({status:"fail",message: err.message});
  }

}