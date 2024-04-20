const productModel= require('../Models/productModel');
const APIFeatures = require('./../utilities/APIFeatures');
const userModel = require('./../Models/userModel')
const multer  = require('multer');
const sharp = require('sharp');

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

exports.uploadProductImages = upload.fields([
    {name:'imageCover', maxCount:1},
    {name:'images', maxCount:4}
])

exports.resizeImages = async (req,res,next) => {
    try{
        if(!req.files.imageCover || !req.files.images) return next();
        const imageCoverFileName = `product-${req.params.id}-${Date.now()}-cover`;
        await sharp(req.files.imageCover[0].buffer)
        .resize(2000,1333)
        .toFormat('jpeg')
        .jpeg({quality:90}).
        toFile(`public/images/products/${imageCoverFileName}.jpg`);
        req.body.imageCover=`http://127.0.0.1:3000/images/products/${imageCoverFileName}.jpg`;
    

        req.body.images=[];
        await Promise.all(
            req.files.images.map(async (img,i)=>{
                const imageFileName = `product-${req.params.id}-${Date.now()}-${i}`;
                await sharp(req.files.images[i].buffer)
                .resize(500,500)
                .toFormat('jpeg')
                .jpeg({quality:90}).
                toFile(`public/images/products/${imageFileName}.jpg`);
                req.body.images.push(`http://127.0.0.1:3000/images/products/${imageFileName}.jpg`)
            })
        )


        next();
      }catch(err){
        res.status(400).json({status:"fail",message: err.message});
      }
}

exports.topSellingAlias=(req,res,next)=>{
    req.query.sort='-productSales';
    req.query.limit='2';
    next();
}
exports.createProduct = async(req,res)=>{
    try{
    const userId = req.freshUser._id;
    const user = await userModel.findById(userId);
    const newProduct = await productModel.create(req.body);
    user.sellerProducts.push(newProduct);
    user.save({validateBeforeSave:false});
    res.status(201).json({
        status:'success',
        data:{
            product: newProduct
        }
    });
    }catch(err){
        res.status(400).json({status:"fail",message: err.message});
    }
}

exports.getProducts = async(req,res)=>{
    try{
       
        let apiFeatures = new APIFeatures(productModel.find(),req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
        const products =await apiFeatures.query;
        // send response
        res.status(200).json({
            status:'success',
            results:products.length,
            data:{products}
        });
    }catch(err){
        res.status(400).json({status:"fail",message: err.message});
    }
}

exports.getProduct = async(req,res)=>{
    try{
        const id = req.params.id;
        const product = await productModel.findById(id);
        if(!product) throw new Error("Product not found");
        res.status(200).json({
            status:'success',
            data:{product}
        });
    }catch(err){
        res.status(400).json({status:"fail",message: err.message});
    }
}

exports.updateProduct = async(req, res) =>{
    try{
        const id = req.params.id;
        const newProudct = await productModel.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            status:'success',
            data:{newProudct}
        });

    }catch(err){
        res.status(400).json({status:"fail",message: err.message});
    }

}

exports.deleteProductById = async(req,res)=>{
    try{
        await productModel.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status:'success',
            data:null
        });
    }catch(err){
        res.status(400).json({status:"fail",message: err.message});
    }
}

exports.getSellerProducts= async(req, res)=>{
    try{
        const id = req.params.id;
        const user = await userModel.findById(id);
        
        res.status(200).json({
            status:'success',
            data:{
                sellerProducts:user.sellerProducts
            }
        });
    }catch(err){
        res.status(400).json({status:"fail",message: err.message});
    }
}

//! get stats using aggregate functions
exports.getStatus = async (req, res)=> {
    try{
        const status = await productModel.aggregate([
            {$match:{price:{$gte:500}}}
            ,
            {$group:{
                _id: {$toUpper:'$description'},  //* what we will group with which will result in stats foreach item
                minimum:{$min : '$price'},
                maximum:{$max:'$price'},
                AveragePrice:{$avg:'$price'},
                sum:{$sum:1}
            }}
            ,
            {
                $sort:{sum:1}  // 1 for ascending
            }
            ,
            {
                $match : {_id:{$ne:'COMPUTER'}}
            }
        ]);

        res.status(200).json({
            status:'success',
            results:status.length,
            data:{status}
        });
    }catch(err){
        res.status(400).json({status:"fail",message: err.message});
    }
}