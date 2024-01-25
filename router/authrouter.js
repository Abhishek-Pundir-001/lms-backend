const express = require('express');
const authRouter = express.Router();
const {signup,signin,getuser,logout} = require('../controller/authcontroller');
const jwtAuth = require('../middleware/jwtAuth');
authRouter.post('/signup',signup);
authRouter.post('/signin',signin);
authRouter.get('/user',jwtAuth,getuser);
authRouter.get('/logout',logout);
module.exports = authRouter;