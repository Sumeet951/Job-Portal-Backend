import User from "../models/user.model.js";
import AppError from "../utils/appError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import { v2 } from "cloudinary";
const cookieOptions=
    {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
}

// @Register
export const register=async(req,res,next)=>{
    try{
const {fullname,email,phoneNumber,password,role}=req.body;
if(!fullname || !email || !phoneNumber || !password || !role){
    return next(new AppError("All fields are required",400));
}
const file=req.file;
const fileuri=getDataUri(file);
const cloudResponse=await v2.uploader.upload(fileuri.content)
const user=await User.findOne({email});
if(user){
    return next (new AppError("User already exists",400));
}
const hashedPassword=await bcrypt.hash(password,12);
const newUser=await User.create({
    fullname,
    email,
    phoneNumber,
    password:hashedPassword,
    role,
    profile:{
        profilePhoto:cloudResponse.secure_url
    }
})
newUser.password=undefined;
res.status(201).json({
    success:true,
    message:"User registered successfully",
    user:newUser,

})
    }
    catch(err){
        return next(new AppError(err.message,500))
    }
}
// @Login
export const login=async(req,res,next)=>{
    try{
        
        const {email,password,role}=req.body;
        if(!email || !password){
            return next(new AppError("All fields are required",400))
        }
        const user=await User.findOne({email});
        if(!user){
            return next(new AppError("Incorrect email or Password",400))
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return next(new AppError("Incorrect email or Password",400))
        }
        if(role && user.role !== role){
            return next(new AppError("Account doesnt exist with current role",403))
        }
        const tokenData={
            userId:user._id,
        }
        const token=await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:"7d"});
        user.password=undefined;
        res.cookie('token',token,cookieOptions)
        res.status(200).json({
            success:true,
            message:"Login Successful",
            user
        })
        
    }
    catch(err){
        return next(new AppError(err.message,500))
    }
}
export const logout=async(req,res,next)=>{
    try{
        res.cookie('token','', {...cookieOptions, maxAge: 0});
          res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });


    }
    catch(err){
        return next(new AppError(err.message,500))
    }
}

export const updateProfile=async(req,res,next)=>{
    try{
        console.log(req.body)
const { fullname, email, phoneNumber, bio, skills } = req.body || {};
       if(req.file){
         const file=req.file;
        const fileUri=getDataUri(file);
    const cloudResponse=await v2.uploader.upload(fileUri.content)
       }
        // if(!fullname || !email || !phoneNumber || !bio || !skills){
        //     return next (new AppError("All fields are required",400))
        // }
        //cloudinary part comes later
const skillsArray = skills ? skills.split(",") : [];       
 const userId=req.user.userId;
        const user=await User.findById(userId);
        if(!user){
            return next (new AppError("User not found",404))
        }
        //Updating Data
       if(fullname) user.fullname=fullname;
        if(email) user.email=email;
        if(phoneNumber) user.phoneNumber=phoneNumber;
       if(bio) user.profile.bio=bio;
        if(skills) user.profile.skills=skillsArray;
        if(req.file){
            if(cloudResponse) {
            user.profile.resume=cloudResponse.secure_url; //save the cloudinary url
            user.profile.resumeOriginalName=file.originalname; //save original file name
        }
        }

        //resume comes later
        await user.save();
        user.password=undefined;
        res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            user,
        })
    }
    catch(err){
        return next(new AppError(err.message,500))
    }
}
export const getProfile=async(req,res,next)=>{
    try{
        const userId=req.user.userId;
        const user=await User.findById(userId);
        if(!user){
            return next (new AppError("User not found",404))
        }
        user.password=undefined;
        res.status(200).json({
            success:true,
            message:"Profile fetched successfully",
            user,
        })
    }
    catch(err){
        return next(new AppError(err.message,500))
    }
}