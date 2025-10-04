import { useState, useRef, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  ArrowLeft,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";

const TOTAL_TIME = 2400; // 40 minutes in seconds

const WritingTest3 = ({ onComplete, onExit }) => {
  const { user, session } = useAuth();

  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [showResults, setShowResults] = useState(false);
  const [completedTime, setCompletedTime] = useState(0);
  const timerRef = useRef(null);

  const WRITING_TASK = {
    instructions:
      "You should spend about 40 minutes on this task. Write about the following topic:",
    question:
      "Maintaining public libraries is a waste of money since computer technology can replace their functions. Do you agree or disagree?",
    guidelines: [
      "Give reasons for your answer and include any relevant examples from your own knowledge or experience.",
      "Write at least 250 words.",
    ],
  };

  // Timer effect
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(timerRef.current);
      handleSubmit();
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const countWords = (text) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    const timeTaken = TOTAL_TIME - timeLeft;
    setCompletedTime(timeTaken);
    setShowResults(true);

    // Save to database
    try {
      if (!session) {
        throw new Error("No active session");
      }

      const response = await fetch(
        "https://smjypkielfgtyaddrpbb.supabase.co/functions/v1/handle-submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            user_id: user.id,
            test_type: "writing",
            test_number: 3,
            task_number: 1,
            completed_at: new Date().toISOString(),
            time_taken_seconds: timeTaken,
            status: "completed",
            essay_text: answer,
            word_count: countWords(answer),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.error || "Failed to save test");
      }

      const data = await response.json();
      console.log("Test saved successfully:", data);
    } catch (error) {
      console.error("Failed to save test:", error);
      alert(
        "Warning: Test results may not have been saved. Please contact support if this persists."
      );
    }

    if (onComplete) {
      onComplete({
        answer,
        wordCount: countWords(answer),
        completedTime: timeTaken,
      });
    }
  };

  const generateChatGPTPrompt = () => {
    return `I need you to act as an expert IELTS Writing examiner. Please evaluate my IELTS Writing Task 2 essay and provide detailed feedback.

**Writing Task:**
${WRITING_TASK.question}

**My Answer:**
${answer}

**Please provide:**
1. An approximate IELTS band score (1-9) with justification
2. Detailed feedback on:
   - Task Achievement (how well I addressed all parts of the question)
   - Coherence and Cohesion (organization and linking of ideas)
   - Lexical Resource (vocabulary range and accuracy)
   - Grammatical Range and Accuracy
3. Specific strengths in my writing
4. Key areas for improvement with concrete examples
5. Suggestions for how to improve my score

Please be thorough and constructive in your feedback.`;
  };

  const handleAskChatGPT = () => {
    const prompt = generateChatGPTPrompt();
    const encodedPrompt = encodeURIComponent(prompt);

    // Detect if mobile or desktop
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Try to open ChatGPT app, fallback to web
      window.location.href = `chatgpt://chat?message=${encodedPrompt}`;
      setTimeout(() => {
        window.open(`https://chat.openai.com/?q=${encodedPrompt}`, "_blank");
      }, 500);
    } else {
      // Open in new tab for desktop
      window.open(`https://chat.openai.com/?q=${encodedPrompt}`, "_blank");
    }
  };

  const renderResults = () => {
    const wordCount = countWords(answer);
    const meetsWordCount = wordCount >= 250;

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-4">Test Completed</h2>

        <div className="grid grid-cols-2 gap-4 text-center mb-8 bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Word Count</p>
            <p
              className={`text-2xl font-bold ${
                meetsWordCount ? "text-green-600" : "text-red-600"
              }`}
            >
              {wordCount} words
            </p>
            <p className="text-xs text-gray-500">
              {meetsWordCount ? "Meets requirement" : "Below 250 words"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Time Taken</p>
            <p className="text-2xl font-bold">{formatTime(completedTime)}</p>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Ready for Expert Feedback?
              </h3>
              <p className="text-blue-800 text-sm mb-3">
                Your essay has been saved. Click the button below to get
                AI-powered feedback from ChatGPT, including an approximate band
                score and detailed improvement suggestions.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 mb-6 max-h-96 overflow-y-auto">
          <h3 className="font-semibold text-lg mb-3">Your Answer:</h3>
          <div className="text-gray-700 whitespace-pre-wrap">
            {answer || (
              <span className="text-gray-400 italic">No answer provided</span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleAskChatGPT}
            disabled={!answer.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MessageSquare className="h-5 w-5" /> Ask ChatGPT to Grade
          </button>
          <button
            onClick={onExit}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft className="h-5 w-5" /> Back to All Tests
          </button>
        </div>
      </div>
    );
  };

  const renderTest = () => {
    const wordCount = countWords(answer);

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">IELTS Writing Test 3</h2>
          <div
            className={`flex items-center gap-2 font-semibold text-lg p-2 rounded-md ${
              timeLeft < 300 ? "text-red-600 bg-red-100" : "text-gray-700"
            }`}
          >
            <Clock className="h-5 w-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">WRITING TASK 1</h3>
          <p className="text-blue-800 text-sm mb-3">
            {WRITING_TASK.instructions}
          </p>
          <p className="text-gray-800 font-medium mb-3 leading-relaxed">
            {WRITING_TASK.question}
          </p>
          {WRITING_TASK.guidelines.map((guideline, idx) => (
            <p key={idx} className="text-blue-800 text-sm mb-1">
              {guideline}
            </p>
          ))}
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="font-semibold text-gray-700">Your Answer:</label>
            <span
              className={`text-sm font-medium ${
                wordCount >= 250 ? "text-green-600" : "text-gray-600"
              }`}
            >
              {wordCount} words
            </span>
          </div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full h-96 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none font-sans"
            placeholder="Type your essay here..."
          />
          <p className="text-xs text-gray-500 mt-2">
            Minimum 250 words required{" "}
            {wordCount < 250
              ? `• ${250 - wordCount} more words needed`
              : "• Word count met"}
          </p>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <button
            onClick={onExit}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Exit Test
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
          >
            <CheckCircle className="h-4 w-4" /> Submit Test
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {showResults ? renderResults() : renderTest()}
    </div>
  );
};

export default WritingTest3;
