import express from "express";
import { create , getMessagesByRequest, remove, show, showid, update } from "../controller/request.js"
import authMiddleware from "../middleweare/authenticaton.js";
import {upload} from "../middleweare/Cloudnary.js";

const router = express.Router();

router.post("/create", upload.array("image"), authMiddleware, create)
router.get("/show/:id", authMiddleware, show);
router.post("/seeall",authMiddleware,showid);
router.put("/update/:id",upload.array("image"),authMiddleware, update);
router.get("/:requestId", authMiddleware, getMessagesByRequest);
router.delete("/delete/:id", authMiddleware, remove);

//after competed delete it
router.get("/seen", (req, res) => {
    res.status(200).json({ message: "You are authorized", user: req.user });
});


export default router;