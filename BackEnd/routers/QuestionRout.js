import express from "express";

import authMiddleware from "../middleweare/authenticaton.js";
import { seeQuestions , addQuestion, submitQuestions } from "../controller/Questions.js";

const router = express.Router();


//my rout
router.get("/", authMiddleware, seeQuestions);
router.post("/add", authMiddleware, addQuestion);
router.post("/submit", authMiddleware, submitQuestions);


export default router;