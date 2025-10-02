// src/components/ielts/SpeakingTests.js
import { useState, lazy, Suspense } from "react";
import {
  Mic,
  Clock,
  Award,
  Play,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { speakingTests } from "../../data/tests";
import { useTestResults } from "../../hooks/useTestResults";

const SpeakingTests = () => {
  const [activeTest, setActiveTest] = useState(null);
  const [TestComponent, setTestComponent] = useState(null);
  const { tests, totalCompleted, averageScore, loading } =
    useTestResults("speaking");

  // Merge database results with test definitions
  const testsWithStats = speakingTests.map((test) => {
    const stats = tests.find((t) => t.test_number === test.test_number);
    return {
      ...test,
      attempts: stats?.attempts || 0,
      bestRating: stats?.best_score || null,
    };
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStartTest = async (testId) => {
    const test = testsWithStats.find((t) => t.id === testId);
    if (test && test.componentPath) {
      try {
        // Dynamically import the component
        const module = await import(`${test.componentPath}`);
        setTestComponent(() => module.default);
        setActiveTest(test);
      } catch (error) {
        console.error("Failed to load test component:", error);
        alert("Test chưa sẵn sàng!");
      }
    } else {
      alert("Test chưa sẵn sàng!");
    }
  };

  const handleTestComplete = (results) => {
    console.log("Test completed:", results);
  };

  const handleExitTest = () => {
    setActiveTest(null);
    setTestComponent(null);
  };

  if (activeTest && TestComponent) {
    return (
      <div>
        <button
          onClick={handleExitTest}
          className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Tests
        </button>
        <Suspense fallback={<div>Loading test...</div>}>
          <TestComponent
            onComplete={handleTestComplete}
            onExit={handleExitTest}
          />
        </Suspense>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          IELTS Speaking Tests
        </h2>
        <p className="text-gray-600">
          Luyện tập kỹ năng nói với các bài test theo chuẩn IELTS. Mỗi bài test
          gồm 3 phần trong 11-14 phút.
        </p>
      </div>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-8">
        <div className="flex items-start gap-3">
          <MessageSquare className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-orange-900 mb-2">
              How Speaking Tests Work
            </h3>
            <p className="text-orange-800 text-sm">
              Speaking tests use your browser's speech recognition to transcribe
              your answers. You'll see band 8-9 model answers to emulate, and
              you can self-assess your fluency, vocabulary, grammar, and
              pronunciation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Mic className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Available Tests
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {speakingTests.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-semibold text-gray-900">
                {loading
                  ? "..."
                  : averageScore
                  ? `${averageScore.toFixed(1)}/5`
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tests Completed
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {loading ? "..." : totalCompleted}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {testsWithStats.map((test) => (
          <div
            key={test.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {test.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      test.difficulty
                    )}`}
                  >
                    {test.difficulty}
                  </span>
                  {test.bestRating && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Best: {test.bestRating.toFixed(1)}/5
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-4">{test.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{test.duration} phút</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{test.parts} phần</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {test.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {test.attempts > 0 && (
                  <div className="mt-3 text-sm text-gray-500">
                    Đã làm {test.attempts} lần
                  </div>
                )}
              </div>

              <div className="mt-6 lg:mt-0 lg:ml-6">
                <button
                  onClick={() => handleStartTest(test.id)}
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <Play className="h-4 w-4" />
                  {test.attempts > 0 ? "Làm lại" : "Bắt đầu"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeakingTests;
