const mongoose=require("mongoose")
const mongoConnect=()=>{
    mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true,
  useUnifiedTopology: true,
})
    .then(()=>{
        console.log("MongoDB Connected Successfully");
    })
    .catch((err)=>{
        console.log(err);
        
    })
}
module.exports=mongoConnect