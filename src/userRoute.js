const express=require("express")
const UserModel=require("./userModel")
const app=express.Router()
const jwt=require("jsonwebtoken")
const argon2=require("argon2")
const auth=require("./authMiddleware")

app.post("/signup",async(req,res)=>{
const {name,email,password}=req.body
//console.log(username,email,password);
const hash=await argon2.hash(password)
try{
    const user=new UserModel({name,email,password:hash})
    await user.save()
    return res.status(201).send("user created")

}
catch(e){
    console.log(e.message)
    return res.send(e.message)
}
})


app.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    const user=await UserModel.findOne({email});
  console.log(user,password)
  if(user){
    if(await argon2.verify(user.password,password)){
        const token=jwt.sign({id:user._id,name:user.name,email:user.email},"SECRET",{expiresIn:"24 hours"})
        const refreshToken=jwt.sign({id:user._id,name:user.name,email:user.email},"REFRESH",{expiresIn:"7 days"})
        return res.status(201).send({message:"login sucess",token,refreshToken,user})
    }
    else{
        return res.status(401).send("wrong credentials")
    }
  }
  else{
    return res.status(401).send("wrong credentials")
}

    
})

//update 
app.put("/:id",auth,async(req,res)=>{

            try{
                const updateUser=await UserModel.findByIdAndUpdate(req.params.id,
                    {
                        $set:req.body,
                    },{new:true})
                res.status(200).send(updateUser)
            }catch(e){
                res.status(401).send("you can update only your account")
            }
    
})



//delete
app.delete("/:id",auth,async(req,res)=>{
 
try{
    await UserModel.findByIdAndDelete(req.params.id)
    return res.status(200).send("account deleted");

}catch(e){
    return res.send(e.message)
}

    
})


//Get
app.get("/:id",auth,async(req,res)=>{


        try{
            const user=await UserModel.findById(req.params.id)
            const {password,...others}=user._doc
            return res.send(others)
        }
        catch(e){
            res.status(500).send(e.message)
        }

 

   
});




module.exports=app;
