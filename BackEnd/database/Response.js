import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  answers: [{ id: String, answer: String }],
  score: Number,
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Response", responseSchema)