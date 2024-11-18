import jwt from "jsonwebtoken";

export const auth = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt_token
        if(!token){
            return res.status(401).json({message:"Unauthorized",success:false})
        }
        jwt.verify(token,process.env.JWT_KEY,(err,decode)=>{
        
            
            if(err){
                return res.status(401).json({message:"Unauthorized",success:false})
            }
            req.user = decode;
            next()
        })
    } catch (error) {
        res.status(500).json({message:error.message,success:false})
    }
}