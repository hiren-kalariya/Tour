const User = require('../Models/userModel')
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/mail')
const singToken = (userId) => {
    return jwt.sign({id:userId}, process.env.JWT_SECRATE, {
        expiresIn: process.env.JWT_EXPIREIN
    })
}

exports.singup = async (req, res) => {
    try {
        const newUser = await User.create(req.body)
        const token = singToken(newUser._id)
        res.status(200).json({
            status: "sucess",
            token,
            data: {
                user: newUser
            }
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            status: "fail",
            message: error
        })
    }
}


exports.login = async (req, res) => {
    const {
        email,
        password
    } = req.body

    // 1)check if id and password exist

    if (!email || !password) {
        res.send(404).json({
            status: "fail",
            message: "username nad password must be requires"
        })
    } 

    // 2)chek if user exitst and password is correct

    const user = await User.findOne({email}).select('password')
   
    const correctPassword =await user.comparePassword(password)
    // console.log(user +""+ correctPassword);
    if(user && correctPassword )
    {
        const token = singToken(user._id)
        res.status(200).json({
            status: "sucess",
            message: "user login sucessfully",
            token
        })
    }
    else
    {
        res.status(404).json({
            status:"fail",
            "message":"userlogin fail bcz id and password not match"
        })
    }


    // 3)if averything ok than send jwt token to clint
}


exports.protected = async (req, res, next) => {
    // 1)acess token from headar
    let token;
    if(req.headers.authorization==null){
        res.status (404).json({ 
            "status":"fail",
            "message":"first login for acees"
        })
    }
    else{
    if(req.headers.authorization.startsWith("Bearer"))
    {
        token = req.headers.authorization.split(' ')[1]
        console.log(token);
       
    }
    
   if(!token)
    {
        res.status(401).json({ 
            "status": 'fail',
            "message": "user not authorized"
        })
    }
   
    // 2)verification token
    const jwtUser = await jwt.verify(token, process.env.JWT_SECRATE);
    console.log(jwtUser);

    // 3)user still exits
    const freshUser = await User.findById(jwtUser.id);

    if(!freshUser) {
        res.status(401).json({
            "status": "fail",
            "message": "user not found"
        })
    }


    // 4)after change details 
    if(freshUser.chagePasswordAfter(jwtUser.iat))
    {
        res.status(401).json({
            status: "fail",
            "message": "user currently change password login again"
        })
    }
    else{
        req.user = freshUser
    next();
    }
} 

}

exports.resticTo = (...roles) => {
return (req, res, next) => {
    if(!roles.includes(req.user.role))
    {
        res.status(403).json({
            "status": "fail",
            message: ` ${req.user.role}  are not authorized for  this portion`
        })
       
    }
    else
    {
        next();
    }
}
}

exports.forgotPassword = async (req, res) => {
    // 1)check user email is found or not

    const user= await User.findOne({email:req.body.email})
    console.log(user);
    let forgotPasswordToken
    if(!user) {
        res.status(404).json({
            status: "fail",
            message:"user not found"
        })
    }
    else {
         forgotPasswordToken =user.forgotPassword()

      
        await user.save({validateBeforeSave:false})
    }

    // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${forgotPasswordToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({
        status:"fail",
        message:"mail not send"
    })
  }
}

exports.resetPassword = async (req, res) => {
    // 1)get user using token
    const resetToken=req.params.resetToken
    console.log(resetToken)
    const user = await User.findOne({passwordResetToken:resetToken,passwordResetExpires:{$gt: Date.now()}})

    //2) check the token not expire
    if(!user){
       res.status(400).json({
            status:"fail",
            message:"expirt reset token plz try again"
        })
    }
    user.passwordResetToken=undefined
    user.passwordResetExpires = undefined
    user.password = req.body.password 
    // 3) update chnagepasswordAt proparty
    user.passwordChangeAt=Date.now()
    // 4)log the user andd send jwt
    await user.save();
    const token = singToken(user._id)
    res.status(200).json({
        status: "sucess",
        token
    })
 
}

exports.updatePassword = async (req, res) => {
    const user = await User.findById(req.user._id)

    user.password = req.body.password
    await user.save()

    const token = singToken(user._id)
    res.status(200).json({
        status: "sucess",
        token
    })
}