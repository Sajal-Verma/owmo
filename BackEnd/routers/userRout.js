import express from "express";
import { register, login, logout, update, del, see , forgotPassword , ZipTech, showAll } from "../controller/users.js";
import {refresh} from "../controller/refresh.js";
import authMiddleware from "../middleweare/authenticaton.js";
import {upload} from "../middleweare/Cloudnary.js";


import {getDiagnosi} from "../ML/ml.js"
import { CreateOtp , VerifyOtp} from "../controller/Otp.js";

const router = express.Router();

//for user
router.post("/register",register);
router.post("/login", login);
router.post("/forgot",forgotPassword);
router.post("/createOtp",CreateOtp)
router.post("/VerifyOtp",VerifyOtp)
router.post("/logout", authMiddleware,logout);
router.put("/update/:id",upload.single("image"),authMiddleware ,update);
router.get("/show/:id", authMiddleware, see);
//serch
router.get("/TechByPin", authMiddleware, ZipTech);

//for admin
router.delete("/del/:id", authMiddleware ,del);
router.post("/showAll/:id",authMiddleware,showAll);

//ml api for find the issue
router.post("/diagnose", authMiddleware,getDiagnosi);

//refresh token
router.get("/refresh",refresh);

export default router;
