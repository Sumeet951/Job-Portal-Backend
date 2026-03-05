import {Schema,model} from "mongoose";
import mongoose from "mongoose";
const userSchema=new Schema({
    fullname:{
        type:String,
        requires:true
    },
    email:{
        type:String,
        requires:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['student','recruiter'],
        required:true,
    },
    phoneNumber:{
        type:Number,
    },
    profile:{
        bio:{
            type:String,
        },
        skills:[{type:String}],
        resume:{type:String},
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId,ref:'Company'} ,
        profilePhoto:{
            type:String,
            default:''
        }
    }
},{timestamps:true})
const User=model('User',userSchema)
export default User;