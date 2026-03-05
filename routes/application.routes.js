import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { applyjob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";
const router=express.Router();
router.get("/apply/:id",isLoggedIn,applyjob)
router.get("/get",isLoggedIn,getAppliedJobs);
router.get("/:id/applicants",isLoggedIn,getApplicants)
router.post("/status/:id/update",isLoggedIn,updateStatus);
export default router;
