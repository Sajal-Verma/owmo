import express from "express";
import dotenv from "dotenv";
import http from "http";   // <-- REQUIRED
import connectDB from "../database/connect.js";
import userRout from "../routers/userRout.js";
import requestRout from "../routers/requestRout.js";
import QuestionRout from "../routers/QuestionRout.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import socketConnection from "../controller/socket.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect DB
connectDB();

// Middlewares
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/user", userRout);
app.use("/request", requestRout);
app.use("/Question", QuestionRout);

// ------------------------------------------------------
// ❗ CREATE HTTP SERVER
const server = http.createServer(app);

// ❗ PASS HTTP SERVER TO SOCKET.IO
socketConnection(server);
// ------------------------------------------------------

// Start Server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
