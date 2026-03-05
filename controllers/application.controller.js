import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import AppError from "../utils/appError.js";
export const applyjob = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const jobId = req.params.id;
    if (!jobId) {
      return next(new AppError("Job ID is required", 400));
    }
    //Check if the user has already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return next(new AppError("You have already applied for this job", 400));
    }
    //check if job exists
    const jobs = await Job.findById(jobId);
    if (!jobs) {
      return next(new AppError("Job not found", 404));
    }
    //Create new application
    const application = await Application.create({
      job: jobId,
      applicant: userId,
    });
    jobs.application.push(application._id);
    await jobs.save();
    return res.status(201).json({
      success: true,
      message: "Job application successfully",
      jobs,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
export const getAppliedJobs = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "companyId",
          options: { sort: { createdAt: -1 } },
        },
      });
    if (!application) {
      return next(new AppError("No applied jobs found", 404));
    }
    return res.status(200).json({
      success: true,
      message: "Applied jobs fetched successfully",
      application,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
//admin dekhega kitne user ne apply kiya hai
export const getApplicants = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "application",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
        options: { sort: { createdAt: -1 } },
      },
    });
    if (!job) {
      return next(new AppError("Job not found", 404));
    }
    return res.status(200).json({
      success: true,
      job,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
export const updateStatus = async (req, res, next) => {
  try {
  const { status } = req.body;
  console.log(status);
     const applicationId = req.params.id;
    if (!status) {
      return next(new AppError("Status is required", 400));
    }
    //Find the application by applicationId
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return next(new AppError("Application not found", 404));
    }
    //Update the status
    application.status = status.toLowerCase();
    await application.save();
    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
