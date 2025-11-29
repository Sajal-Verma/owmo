import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    answer: String,
});


const Questions = mongoose.model("Questions",QuestionSchema);
export default Questions;
