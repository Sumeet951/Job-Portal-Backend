import jwt  from "jsonwebtoken";
import AppError from "../utils/appError.js";
export const isLoggedIn=async (req,res,next)=>{
    try{
        const {token}=req.cookies;
    if(!token){
        return next (new AppError("You are not logged in! Please login to access this resource",401))
    }
    const decoded=await jwt.verify(token,process.env.SECRET_KEY);
    if(!decoded){
        return next (new AppError("Invalid Token! Please login again",401))
    }
    req.user=decoded;
    next();
    }
    catch(err){
        return next (new AppError(err.message,500))
    }
}