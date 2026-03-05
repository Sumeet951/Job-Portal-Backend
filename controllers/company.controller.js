import { v2 } from "cloudinary";
import Company from "../models/company.model.js";
import AppError from "../utils/appError.js";
import getDataUri from "../utils/datauri.js";
export const registerCompany=async(req,res,next)=>{
    try{
       const {name}=req.body;
       if(!name){
        return next(new AppError("Company name is required",400))
       } 
       let company=await Company.findOne({name});
       if(company){
        return next(new AppError("Company already exists",400))
       }
       company=await Company.create({
        name:name,
        userId:req.user.userId,
       });
       return res.status(201).json({
         success:true,
         message:"Company registered successfully",
         company
       }
       )
    }
    catch(err){
        return next(new AppError(err.message,500))
    }
}
export const getCompany=async(req,res,next)=>{
    try{
        const userId=req.user.userId;
        const companies=await Company.find({userId});
        console.log(companies);
        if(!companies){
            return next(new AppError("No companies found",404))
        }
        return res.status(200).json({
            success:true,
            message:"Companies fetched successfully",
            companies
        })  
    }
    catch(err){
        return next(new AppError(err.message,500))
    }
}
 //Get Company by Id
 export const getCompanyById=async(req,res,next)=>{
    try{
        const companyId=req.params.id;
        const company=await Company.findById(companyId);
        if(!company){
            return next(new AppError("Company not found",404))
        }
        return res.status(200).json({
            success:true,
            message:"Company found",
            company
        })
    }
    catch(err){
        return next(new AppError(err.message,500))
    }
 }
 //Update Company
    export const updateCompany=async(req,res,next)=>{
        try{
        const {name,description,website,location}=req.body;
        const file=req.file;
        const fileuri=getDataUri(file);
const cloudResponse=await v2.uploader.upload(fileuri.content);
const logo=cloudResponse.secure_url;
        //idhar cloudinary aayega
        const updateData={name,description,website,location,logo};
        const company=await Company.findByIdAndUpdate(req.params.id,updateData,{new:true});
        if(!company){
            return next(new AppError("Company not found",404))
        }

        return res.status(200).json({
            success:true,
            message:"Company updated successfully",
            company
        })
        }
        catch(err){
            return next(new AppError(err.message,500))
        }
    }