import express from "express";
import dotenv from "dotenv";
import connectDB from "../database/connect.js";
import userRout from "../routers/userRout.js";
import requestRout from "../routers/requestRout.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cookieParser());
// middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json())

app.use("/user", userRout);
app.use("/request", requestRout);

// create server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
