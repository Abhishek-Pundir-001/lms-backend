const mongoose = require('mongoose');
const { Schema } = mongoose;
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'user name is required'],
        minLength: [5, 'minimum 5 characters are required'],
        maxLength: [10, 'maximum 10 characters are allowed'],
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: [true, 'email already registerd'],
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordExpiry: {
        type: Date
    }
},{
    timestamps:true
})
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password,10)
})
userSchema.methods = {
    jwtToken(){
        return JWT.sign(
            {id:this._id,email:this.email},
            process.env.SECRET,
            {expiresIn:'24h'}
        )
    }
    
}
const userModel = mongoose.model('users', userSchema)
module.exports = userModel;