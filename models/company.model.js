import { Schema,model } from "mongoose";
import mongoose from "mongoose";
const companySchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
    },
    website:{
        type:String,
    },
    experienceLevel:{
        type:Number,
        // required:true
    },
    location:{
        type:String,
    },
    logo:{
        type:String,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})
const Company=model('Company',companySchema)
export default Company;