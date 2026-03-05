import AppError from "../utils/appError.js"
import Job from "../models/job.model.js"

//admin post krega
export const postJob=async(req,res,next)=>{
    try{
        const{title,requirements,description,salary,location,jobType,experience,position,companyId}=req.body;
        const userId=req.user.userId;
        if(!title || !requirements || !description || !salary || !location || !jobType || !experience || !position || !companyId){
            return next (new AppError("All fields are required",400))
        }
        const job=await Job.create({
            title,
            requirements,
            description,
            salary:Number(salary),
            location,
            jobType,
            experienceLevel:experience,
            position,
            companyId,
                created_by:userId
        })
        return res.status(201).json({
            success:true,
            message:"Job posted successfully",
        })
        //Job posting logic here
    }
    catch(err){
        return next(new AppError(err.message,500))
    }}
   export const getAllJobs = async (req, res, next) => {
  try {

    const keyword = req.query.keyword || "";

    const words = keyword.split(" ").filter(Boolean);

    const query = {
      $and: words.map(word => ({
        $or: [
          { title: { $regex: word, $options: "i" } },
          { description: { $regex: word, $options: "i" } },
          { location: { $regex: word, $options: "i" } }
        ]
      }))
    };

    const jobs = await Job.find(query)
      .populate("companyId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      jobs
    });

  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
    //Students
    export const getJobById=async(req,res,next)=>{
        try{
          const jobId=req.params.id;
          const job=await Job.findById(jobId).populate('application'); 
            if(!job){
                return next (new AppError("Job not found",404))
            }
            return res.status(200).json({
                success:true,
                message:"Job fetched successfully",
                job
            })
        }
        catch(err){
            return next(new AppError(err.message,500))
        }
    }
    //admin kitne job create kra hai abhi tak
    export const getAdminJobs=async(req,res,next)=>{
        try{
            const userId=req.user.userId;
            const jobs=await Job.find({created_by:userId}).populate('companyId');
            if(!jobs){
                return next (new AppError("No jobs found",404))
            }
            return res.status(200).json({
                success:true,
                message:"Admin jobs fetched successfully",
                jobs
            })
        }
        catch(err){
            return next(new AppError(err.message,500))
        }
    }
