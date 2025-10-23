import express from "express";
import { register, login, logout, update, del, see } from "../controller/users.js";
import {refresh} from "../controller/refresh.js";
import authMiddleware from "../middleweare/authenticaton.js";
import {upload} from "../middleweare/Cloudnary.js";
import User from "../database/usersDB.js";

import {getDiagnosi} from "../ML/ml.js"

const router = express.Router();

router.post("/register",register);
router.post("/login", login);
router.post("/logout", authMiddleware,logout);
router.put("/update/:id",upload.array("image"),authMiddleware ,update);
router.delete("/del/:id", authMiddleware ,del);
router.get("/show/:id", authMiddleware, see);

//see all user 
router.get("/seen", async (req, res) => {
    const data = await User.find();
    res.status(200).json({ message: "You are authorized", user: data });
});

//ml api for find the issue
router.post("/diagnose",getDiagnosi);

//refresh token
router.get("/refresh",refresh);

export default router;
