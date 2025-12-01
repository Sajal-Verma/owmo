import { useState, useRef, useEffect } from "react";
import axiosInstance from "../utils/authInterceptor";
import { toast } from "react-toastify";

const MobileDiagnosis = () => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hello! Describe the issue with your phone and I will diagnose it using AI.",
    },
  ]);

  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDiagnose = async () => {
    if (!issue.trim()) {
      return toast.error("Please describe the issue!");
    }

    // Push user message to chat
    setMessages((prev) => [...prev, { sender: "user", text: issue }]);

    const userText = issue;
    setIssue(""); // clear input
    setLoading(true);

    try {
      const res = await axiosInstance.post("/user/diagnose", { issue: userText });

      // AI chat response
      const aiMessage = `
        Diagnosis Result
        Issue Provided: ${res.data.issue}
        Prediction: ${res.data.prediction}
      `;

      setMessages((prev) => [...prev, { sender: "ai", text: aiMessage }]);
      toast.success("Diagnosis Completed!");

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "❌ I could not diagnose the issue. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#BBBDBC]">

      {/* HEADER */}
      <div className="bg-[#a6a7a6] text-black p-1 text-center text-lg font-semibold shadow-md">
        AI Mobile Diagnosis
      </div>

      {/* CHAT WINDOW */}
      <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-xl shadow-md whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "bg-[#73a399] text-white rounded-br-none"
                  : "bg-[#dbdbdb] text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* AI TYPING INDICATOR */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#dbdbdb] p-3 rounded-xl shadow-md">
              <span className="animate-pulse">AI is diagnosing...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      {/* INPUT SECTION */}
      <div className="py-2 px-4 bg-[#a6a7a6] flex gap-2 border-t shadow-md">
        <input
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleDiagnose()}
          placeholder="Describe your phone issue…"
          className="flex-1 p-2 border rounded-lg focus:ring focus:ring-[#959595]"
        />

        <button
          onClick={handleDiagnose}
          disabled={loading}
          className="px-4 bg-[#52AB98] text-white rounded-lg font-semibold hover:bg-[#428879] disabled:bg-gray-400"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MobileDiagnosis;
