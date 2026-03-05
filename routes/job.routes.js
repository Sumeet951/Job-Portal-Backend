import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";
const router=express.Router();
router.post("/post",isLoggedIn,postJob)
router.get("/get",isLoggedIn,getAllJobs)
router.get("/getadmin",isLoggedIn,getAdminJobs)
router.get("/:id",isLoggedIn,getJobById)

export default router;