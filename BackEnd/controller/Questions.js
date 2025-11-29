import Questions from "../database/QuestionDB.js";
import Response from "../database/Response.js";

// ✅ Get all quiz questions
export const seeQuestions = async (req, res) => {
    try {
        const questions = await Questions.find().select("-answer"); // hide answers
        res.status(200).json(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({
            message: "Error while fetching questions",
            error: error.message,
        });
    }
};

// ✅ Add a new quiz question
export const addQuestion = async (req, res) => {
    try {
        console.log(req.body);
        const { question, options, answer } = req.body;

        if (!question || !options || !answer) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const q = new Questions({ question, options, answer });
        await q.save();

        return res.status(201).json({ message: "Question added successfully" });
    } catch (error) {
        console.error("Error adding question:", error);
        res.status(500).json({
            message: "Error while adding question",
            error: error.message,
        });
    }
};

// ✅ Submit quiz answers
export const submitQuestions = async (req, res) => {
    try {
        const { responses } = req.body;

        if (!responses || !Array.isArray(responses)) {
            return res.status(400).json({ message: "Invalid response data" });
        }

        const allQuestions = await Questions.find();
        let score = 0;

        responses.forEach((r) => {
            const q = allQuestions.find((q) => q._id.toString() === r.id);
            if (q && q.answer === r.answer) score++;
        });

        const newResponse = new Response({
            user: req.user.id,
            answers: responses,
            score,
        });

        await newResponse.save();

        res.status(200).json({ message: "Quiz submitted", score });
    } catch (error) {
        console.error("Error submitting quiz:", error);
        res.status(500).json({
            message: "Error while submitting quiz",
            error: error.message,
        });
    }
};
