import express from "express";
import { getProfile, login, logout, register, updateProfile } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { singleUpload } from "../middlewares/multer.middleware.js";
const router=express.Router();
router.post("/register",singleUpload,register)
router.post("/login",login)
router.put("/profile/update",isLoggedIn,singleUpload,updateProfile)
router.get("/logout",isLoggedIn,logout)
router.get("/profile",isLoggedIn,getProfile)

export default router;