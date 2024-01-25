const express = require('express');
const cors = require('cors');
const app = express();
const authRouter = require('./router/authrouter');
const databaseconnect = require('./config/databaseconfig');
const cookieParser = require('cookie-parser')
databaseconnect()
app.use(cookieParser())
app.use(express.json())
app.use('/api/auth/',authRouter)
app.use('/',(req,res)=>{
    res.status(200).json({data:"JWT auth server"})
})

module.exports = app;
