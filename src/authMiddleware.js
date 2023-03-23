const jwt=require("jsonwebtoken")

module.exports=async(req,res,next)=>{
    try{
          const token=req.headers["authorization"];
          //console.log(token,"midlleware")
          if(token){
            const decoded=jwt.decode(token)
           //console.log(decoded,"decodedmiddleware")
            if(decoded.id===req.params.id ){
                //console.log(decoded.id)
               next()

            }else{
                return res.status(401).send("you have only access to your account")
            }

          }else{
            return res.status(401).send("Token required")
          }
       
    }
    catch(e){

    }
}