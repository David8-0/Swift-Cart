const userModel = require('./../Models/userModel');




exports.getAllUsers=async function(req, res) {
  try{
      const users =await userModel.find();
      res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
          users
        }
      });
    }catch(err){
      res.status(400).json({status:"fail",message: err.message});
    }
  }
 
  exports.getuser=async function(req, res) {
    try{
      const user =await userModel.findById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
    }catch(err){
      res.status(400).json({status:"fail",message: err.message});
    }
  }
  exports.updateUser=async function(req, res) {
    try{
      // const user = await userModel.findById(req.freshUser._id);
      const allowedObj = filterObj(req.body,'name','email','sellerProducts','favorites','cart');
      const updatedUser= await userModel.findByIdAndUpdate(req.freshUser._id,allowedObj,{
        runValidators: true,
        new:true
      });
      res.status(200).json({
        status: 'success',
        data: {
          user: updatedUser
        }
      });
    }catch(err){
        res.status(400).json({status:"fail",message: err.message});
    }
  }
  exports.deleteUser=async function(req, res) {
    try{
      const user =await userModel.findByIdAndDelete(req.params.id);
      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
    }catch(err){
      res.status(400).json({status:"fail",message: err.message});
    }
  }




//   try{
    
// }catch(err){
//     res.status(400).json({status:"fail",message: err.message});
// }
//* util methods
const filterObj = (obj,...allowed)=>{
  let newObj = {};
  Object.keys(obj).forEach(key=>{
    if(allowed.includes(key)){
      newObj[key] = obj[key];
    }
  })
  return newObj;
}