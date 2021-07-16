const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'user name must be required'],
        maxlength:25,
        minlength:2
    },
    email: {
        type: String,
        required: [true, 'email must be required'],
        unique: [true, 'email must be unique'],
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'enter valid email']
    },
    photo: {
        type: String
    },
    role: {
        type :String,
        enum: ['user', 'admin', 'guide', 'lead-guide'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'password must be required'],
        minlength: [5, 'password must be at least 5 characters'],
        select:false
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
},
{
    timestamps: true 
})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()

    this.password=await bcrypt.hash(this.password, 12)
    next();
})

userSchema.methods.comparePassword = async function(password) {
    
    return await bcrypt.compare(password, this.password);

};

userSchema.methods.chagePasswordAfter =function(iat) {
    
   const changeTime=this.passwordChangeAt?parseInt(this.passwordChangeAt.getTime()/1000):0
   console.log(changeTime);
   if(changeTime > iat)
   {
       return true
   }
   return false

};

userSchema.methods.forgotPassword = function(){
    const forgotToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = forgotToken
    this.passwordResetExpires = Date.now() + 10*60*1000
    return forgotToken
}
const User = mongoose.model('user', userSchema)

module.exports = User
