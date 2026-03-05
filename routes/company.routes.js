import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.middleware.js";
const router=express.Router();
router.post("/register",isLoggedIn,registerCompany)
router.get("/get",isLoggedIn,getCompany)
router.get("/get/:id",isLoggedIn,getCompanyById)
router.put("/update/:id",isLoggedIn,singleUpload,updateCompany)

export default router;