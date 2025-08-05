const bcrypt = require("bcrypt");
const User = require("../model/User.models");
const jwt = require("jsonwebtoken");
const { transporter } = require("../Mail");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        console.log(name, email, password);

        if (!name || !email || !password) {
            return res.send({ status: 0, msg: "All Fields are Required" })
        }
        const hashPass = await bcrypt.hash(password, 10)
        const user = new User({
            name, email, password: hashPass
        })
        await user.save()
        try {

            const a = await transporter.sendMail({
                from: 'anirbansukul24@gmail.com',
                to: email,
                subject: "🎉 Welcome to Our Community!",
                text: `Hi ${name},

Thank you for registering with us! We're excited to have you on board.

If you have any questions or need assistance, feel free to reply to this email.

Best regards,  
The Team Anirban`,
                html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Welcome to Our Community, ${name}!</h2>
      <p>Thank you for registering with us. We're excited to have you on board.</p>
      <p>If you have any questions or need assistance, feel free to reply to this email.</p>
      <p>Best regards,<br><strong>The Team Anirban</strong></p>
    </div>
  `,
            });
            console.log("Mail Send", a);
        }
        catch (mailError) {
            console.log("Error in Send Mail is:", mailError);

        }
        return res.send({ status: 1, msg: "User Registered Successfully" })
    }
    catch (error) {
        return res.send({ status: 0, msg: error.message })
    }

}
const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.send({ status: 0, msg: "All Fields are Required" })
    }
    const user = await User.findOne({ email })
    if (!user) {
        return res.send({ status: 0, msg: "User not Found" })
    }
    const compPass = await bcrypt.compare(password, user.password)
    if (!compPass) {
        return res.send({ status: 0, msg: "Invalid Password" })
    }
    const token = await jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' })
    res.cookie("Token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "Production"
    })
    return res.send({ status: 1, msg: "User Login Successfully",token })
}
const getData=async (req,res)=>{
   try{
    console.log(req.userId);
     const userId=req.userId
    const user=await User.findById(userId)
     if (!user) {
        return res.send({ status: 0, msg: "User not Found" })
    }
   return res.send({ status: 1, msg: user })
   }
   catch(err){
    console.log(err);
   }

}
const logout = async (req, res) => {
    try {
        const a = await res.clearCookie("Token")
        return res.send({ status: 1, msg: "User Logout Successfully" })
    }
    catch (err) {
        return res.send({ status: 0, msg: err.message })
    }
}
const sendOtp = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.send({ status: 0, msg: "User Not Exists" })
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    try {
        const a = await transporter.sendMail({
            from: 'anirbansukul24@gmail.com',
            to: email,
            subject: "OTP for Reset Password",
            text: `Hi ${user.name || "User"},\n\nYour OTP for password reset is: ${otp}`
        });
        console.log("Mail Send", a);
    }
    catch (mailError) {
        console.log("Error in Send Mail is:", mailError);

    }
    user.otp = otp
    await user.save()
        .then(() => {
            return res.send({ status: 1, msg: "Otp Send Successfully" })
        })
        .catch((err) => {
            return res.send({ status: 0, msg: err.message })
        })
}
const verifyOtp = async (req, res) => {
    const { otp, password, email } = req.body
    const findUser = await User.findOne({ email })
    if (!findUser) {
        return res.send({ status: 0, msg: "User Not Exists" })
    }
    const compOtp = findUser.otp === otp
    if (!compOtp) {
        return res.send({ status: 0, msg: "Incorrect Otp" })
    }
    const hashPass=await bcrypt.hash(password,10);
    findUser.password = hashPass
    findUser.otp = 0
    await findUser.save()
        .then(() => {
            return res.send({ status: 1, msg: "Password Rest Successfully" })
        })
        .catch((err) => {
            return res.send({ status: 0, msg: err.message })
        })


}
module.exports = { register, login, logout,getData,sendOtp,verifyOtp }