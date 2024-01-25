const userModel = require("../model/userschema");
const emailValidator = require('email-validator');
const  bcrypt = require('bcrypt');
// const { use } = require("../router/authrouter");
const signup = async (req, res, next) => {
    const { name, email, password} = req.body;
    console.log(name, email, password)
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    const validEmail = emailValidator.validate(email);
    if (!validEmail) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email id"
        })
    }
    // if (password !== confirmPassword) {
    //     res.status(400).json({
    //         success: false,
    //         message: 'password and confirm password does not matches'
    //     })
    // }
    try {
        const userInfo = userModel(req.body);
        const result = await userInfo.save()
        return res.status(200).json({
            success: true,
            data: result
        })
    }
    catch (e) {
        if (e.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Account already exist with given email id'
            })
        }
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }

}

const signin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fileds are mandatory'
        })
    }
    try {
        const user = await userModel
            .findOne({
                email
            })
            .select("+password")
        if (!user || !(await bcrypt.compare(password,user.password))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Credentials'
            })
        }
        const token = user.jwtToken();
        user.password = undefined
        const cookieOption = {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true
        }
        res.cookie("token", token, cookieOption);
        res.status(200).json({
            success: true,
            data: user
        })
    }
    catch (e) {
        res.status(400).json({
            success: false,
            message: e.message
        })
    }
}
const getuser = async (req, res, next) => {
    const userId = req.user.id

    try {
        const user = await userModel.findById(userId)
        return res.status(200).json({
            success: true,
            data: `hello ${user.name}`
        })
    }
    catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        })

    }


}
const logout = (req, res, next) => {
    try {
        const cookieOption = {
            expires: new Date(),
            httpOnly: true
        }
        res.cookie("token", null, cookieOption)
        res.status(200).json({
            success: true,
            message: "Logged out"
        })
    }
    catch (e) {
        res.status(400).json({
            success: false,
            message: e.message
        })
    }
}

module.exports = {
    signup,
    signin,
    getuser,
    logout
} 
