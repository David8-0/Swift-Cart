const userModel = require('./../Models/userModel');
const multer  = require('multer');
const sharp = require('sharp');
// const upload = multer({dest:'public/images/users'});

// const multerStorage = multer.diskStorage({
//   destination:(req,file,cb) =>{
//     cb(null,'public/images/users');
//   },
//   filename:(req,file,cb) =>{
//     const ex = file.mimetype.split('/')[1];
//     cb(null,`user-${req.freshUser._id}-${Date.now()}.${ex}`);
//   }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req,file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null,true);
  }else{
    const error = new Error('Only image files are allowed!');
    error.statusCode = 400;
    cb(error,false);
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})


exports.uploadUserPhoto = upload.single('photo');
exports.resizePhoto = async(req,res,next)=>{
  try{
    if(!req.file) return next();
    nameOfFile = `user-${req.freshUser._id}-${Date.now()}`;
    req.file.filename = `http://127.0.0.1:3000/images/users/${nameOfFile}.jpg`;

    await sharp(req.file.buffer)
    .resize(500,500)
    .toFormat('jpeg')
    .jpeg({quality:90}).toFile(`public/images/users/${nameOfFile}.jpg`);

    next();
  }catch(err){
    res.status(400).json({status:"fail",message: err.message});
  }
}


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
      const allowedObj = filterObj(req.body,'name','email','sellerProducts','favorites','cart','phone','Age','address');
      if(req.file) allowedObj.img = req.file.filename;
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