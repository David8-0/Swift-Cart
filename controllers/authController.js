const userModel = require('./../Models/userModel');
const jwt = require('jsonwebtoken');
const sendEmail = require('./../utilities/email')
const crypto = require('crypto');

const signToken = (id,name,email,img,age,role,address)=>{
    return jwt.sign({id,name,email,img,age,role,address},process.env.JWT_SECRET_KEY,{ expiresIn:process.env.JWT_EXPIRE_IN });
}


exports.signup = async (req,res) => {
    try{
        const newUser= await userModel.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            confirmPassword:req.body.confirmPassword,
            phone:req.body.phone,
            Age:req.body.Age,
            role:req.body.role
        });
        const token = signToken(
            newUser._id,
            newUser.name ,
            newUser.email,
            newUser.img,
            newUser.Age,
            newUser.role,
            newUser.address
        );

        res.status(200).json({
            status:'success',
            token,
            data:{newUser}
        });
    }catch(err){
        res.status(400).json({status:"fail",message: err.message});
    }
}

exports.login = async (req,res) => {
    try{
        const{email,password} = req.body;
        if(!email || !password) throw new Error("email and password must be provided");
        
        const user = await userModel.findOne({email:email}).select('+password');
        if(!user || !await user.correctPassword(password,user.password)) throw new Error("email or password is not correct");
        const token = signToken(
            user._id,
            user.name ,
            user.email,
            user.img,
            user.Age,
            user.role,
            user.address
        );

        res.status(200).json({
            status:'success',
            token,
        });
    }catch(err){
        res.status(400).json({status:"fail",message: err.message});
    }
}


exports.forgotPassword=async (req,res)=>{
    try{
        const email = req.body.email;
        if(!email) throw new Error("email must be provided");
        const user = await userModel.findOne({email: email});
        if(!user) throw new Error("this email does not exist");
        const resetToken = user.createResetToken();
        await user.save({validateBeforeSave: false});
        
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    sendEmail(
        user.email,
      'Your password reset token (valid for 10 min)',
      message
    //}
).then(() => {
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
          });
    }).catch(async(err) => {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        console.log(err);
        return res.status(500).json({ status: 'fail',message:'There was an error sending the email. Try again later!' });
    })


    }catch(err){
        res.status(400).json({status:"fail",message: err.message});
    }
}

exports.resetPassword=async(req,res) => {
    try{
        const hashedToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
        const user = await userModel.findOne({passwordResetToken:hashedToken,passwordResetTokenExpire:{$gte:Date.now()}})
        if(!user){
            return res.status(400).json({
                status:'fail',
                message: 'Invalid password reset token'
            })}
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        user.passwordResetToken=undefined;
        user.passwordResetTokenExpire = undefined;
        await user.save();
        const token = signToken(
            user._id,
            user.name ,
            user.email,
            user.img,
            user.Age,
            user.role,
            user.address
        );
        res.status(200).json({
            status: 'success',
            token
        });
         }catch(err){
            res.status(400).json({status:"fail",message: err.message});
        }
}

exports.updatePassword = async(req,res)=>{
    try{
        //const user =await userModel.findById(req.fresUser._id);
        const user = req.freshUser;
        console.log(user);
        if(!user.correctPassword(req.body.oldPassword,user.password)){
            return res.status(403).json({
                status:'fail',
                message: 'Invalid password'
            });
        }
        user.password = req.body.newPassword;
        user.confirmPassword = req.body.newConfirmPassword;
        await user.save();
        const token = signToken(
            user._id,
            user.name ,
            user.email,
            user.img,
            user.Age,
            user.role,
            user.address
        );
        res.status(200).json({
            status:'success',
            token,
        });
    }catch (err) {
        res.status(400).json({status:"fail",message: err.message});
    }
}


//* middlewares
exports.protect = async (req,res,next) => {
    try{
        if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) throw new Error("Token must be provided");
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token,process.env.JWT_SECRET_KEY,async(err,decoded)=>{
          //  console.log(decoded);
            if(err) {
                return res.status(400).json({status:"fail",message: err.message});
            }
            const fresUser = await userModel.findById(decoded.id);
            if(!fresUser) throw new Error("User not found please log in again");
            req.freshUser = fresUser;
            next();
        })
       
    }catch(err){
        res.status(400).json({status:"fail",message: err.message});
    }
}

exports.restrictTo=(role)=>{
    return function(req, res,next){
        if(req.freshUser.role !== role){
            return res.status(403).json({status:"fail",message:"you are no authorized to access this"});
        }
        next();
    }
}

