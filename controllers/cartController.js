const productModel= require('../Models/productModel');
const userModel = require('./../Models/userModel');



exports.addToMyCart = async  (req, res)=> {
    try{
      const user = await userModel.findById(req.freshUser._id);
    //   console.log(user);
      await user.addToCart(req.body.productId);
      res.status(200).json({
        status:'success',
        data:{
            cart:user.cart,
            numberOfItems:user.cart.products.length
        }
      })  
    }catch(err){
        res.status(400).json({status:"fail",message: err.message});
    }
}
exports.clearMyCart = async (req,res)=>{
  try{
    const user = await userModel.findById(req.freshUser._id);
  //   console.log(user);
    user.cart.totalPrice=0;
    user.cart.products=[];
    await user.save({validateBeforeSave:false});
    res.status(200).json({
      status:'success',
      data:{
        cart:user.cart,
        numberOfItems:user.cart.products.length
    }
    })  
  }catch(err){
      res.status(400).json({status:"fail",message: err.message});
  }
}
exports.removeFromMyCart = async (req,res)=>{
  try{
    const user = await userModel.findById(req.freshUser._id);
  //   console.log(user);
    await user.removeFromCart(req.body.productId);
    res.status(200).json({
      status:'success',
      data:{
          cart:user.cart,
          numberOfItems:user.cart.products.length
      }
    })  
  }catch(err){
      res.status(400).json({status:"fail",message: err.message});
  }
}
exports.getMyCart = async (req,res)=>{
  try{
    const user = await userModel.findById(req.freshUser._id);
    res.status(200).json({
      status:'success',
      data:{
          cart:user.cart,
          numberOfItems:user.cart.products.length
      }
    })  
  }catch(err){
      res.status(400).json({status:"fail",message: err.message});
  }
}








//   try{
    
// }catch(err){
//     res.status(400).json({status:"fail",message: err.message});
// }