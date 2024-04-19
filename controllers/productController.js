const productModel= require('../Models/productModel');
const APIFeatures = require('./../utilities/APIFeatures');
const userModel = require('./../Models/userModel')
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