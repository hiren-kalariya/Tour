const User = require('../Models/userModel')
const handlerFactory = require('./handlerFactory')

exports.getAllUsers = async (req, res) => {

    try {
        const users = await User.find();
    res.status(200).json({
        status: "sucess",
        no_of_users: users.length,
        data: {
            users
        }
    })
    } catch (error) {
        res.status(404).json({
            status :"fail",
            message:error
        })
    }
    
}

exports.getMe = async (req, res) => {
    try {
        const user = await User.findOne(req.user._id).select('-__v -passwordChangeAt')

        res.status(200).json({
            status:"sucess",
            data: {
                user
            }
        })
        
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message:"user not found"
        })
    }

}

exports.me = (req,res,next) => {
    req.params.id=req.user._id
    next();
}

exports.getUser = handlerFactory.getOne(User)
exports.updateData = handlerFactory.updateOne(User)
exports.deleteUser = handlerFactory.deleteOne(User)
// exports.updateData = async (req, res) =>{
//     if(req.body.password || req.body.role)
//     {
//         res.status(400).json({
//             status:"fail",
//             message:"in this router user data change not password change"
//         })
//     }
//     else
//     {
//         const user = await User.findByIdAndUpdate(req.user.id,req.body,{new:true, runValidators:true})
//         res.status(200).json({
//             status:"sucess",
//             message:"user data update sucessfully",
//             user
//         })
//     }
// }