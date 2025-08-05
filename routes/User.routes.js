const express=require("express")
const { register, login, logout, getData, sendOtp, verifyOtp } = require("../controllers/User.controllers")
const middleWare = require("../middleware/middleawre")
const route=express.Router()

route.post('/register',register)
route.post('/login',login)
route.post('/logout',logout)
route.get("/profile",middleWare,getData)
route.post('/send-otp',sendOtp)
route.post('/reset-pass',verifyOtp)
module.exports=route