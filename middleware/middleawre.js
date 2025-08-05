const jwt= require("jsonwebtoken")

const middle=async (req,res,next)=>{
try{
 const token = req.headers["auth-token"];
const decodeToken=await jwt.verify(token,process.env.SECRET_KEY)
if(!decodeToken){
   console.log("Not a Verified Token");
}
req.userId=decodeToken._id
req.user=decodeToken
next()
}
catch(error){
    console.log(error);
    
}
}
module.exports=middle