import { useEffect, useState } from "react";
import axiosInstance from "../utils/authInterceptor";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(60);
  const [warnings, setWarnings] = useState(0);
  const navigate = useNavigate();

  // === Fetch quiz questions ===
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axiosInstance.get("/Question/");
        if (res.status === 200) setQuestions(res.data);
      } catch {
        toast.error("Failed to load questions.");
      }
    };
    fetchQuestions();
  }, []);

  // === Trigger warning ===
  const triggerWarning = (reason) => {
    const newWarnings = warnings + 1;
    setWarnings(newWarnings);
    toast.warn(`⚠️ Warning ${newWarnings}/3 — ${reason}`);

    if (newWarnings >= 3) {
      toast.info("❌ Quiz terminated due to multiple violations.");
      handleSubmit();
    }
  };

  // === Fullscreen handling ===
  useEffect(() => {
    const enableFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch {
        toast.error("⚠️ Please allow fullscreen for the quiz.");
      }
    };

    // Request fullscreen initially
    enableFullscreen();

    // Re-enter fullscreen if exited
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        triggerWarning("Exited fullscreen mode.");
        document.documentElement.requestFullscreen().catch(() => {});
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // === Disable right-click and keyboard ===
  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    const disableKeyboard = (e) => {
      e.preventDefault();
      triggerWarning("Keyboard input disabled — use mouse only.");
    };

    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("keydown", disableKeyboard);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keydown", disableKeyboard);
    };
  }, []);

  // === Timer countdown ===
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(countdown);
          toast.error("⏰ Time's up! Auto submitting...");
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  // === Handle answer selection ===
  const handleAnswer = (id, ans) => {
    setAnswers((prev) => ({ ...prev, [id]: ans }));

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  // === Submit quiz ===
  const handleSubmit = async () => {
    try {
      const responses = Object.entries(answers).map(([id, answer]) => ({
        id,
        answer,
      }));

      const res = await axiosInstance.post("/Question/submit", { responses });

      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(() => {});
      }

      toast.success(`✅ Submitted! Your score: ${res.data.score}`);
      navigate("/");
    } catch {
      toast.error("❌ Submission failed. Please try again.");
    }
  };

  // === Loading state ===
  if (questions.length === 0)
    return <p className="text-center mt-10">Loading questions...</p>;

  const q = questions[currentIndex];

  // === UI ===
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between mb-4">
        <p className="text-lg font-semibold">⏱ Time Left: {timer}s</p>
        <p className="text-red-500">⚠ Warnings: {warnings}/3</p>
      </div>

      <div key={q._id} className="mb-6 border-b pb-4">
        <p className="font-semibold mb-2">
          Question {currentIndex + 1} of {questions.length}
        </p>
        <p className="mb-4">{q.question}</p>
        {q.options.map((opt) => (
          <label key={opt} className="block cursor-pointer">
            <input
              type="radio"
              name={q._id}
              value={opt}
              checked={answers[q._id] === opt}
              onChange={() => handleAnswer(q._id, opt)}
            />
            <span className="ml-2">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
