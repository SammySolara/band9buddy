// src/components/ielts/SpeakingTests.js
import { useState } from "react";
import {
  Mic,
  Clock,
  Award,
  Play,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import SpeakingTest1 from "./tests/SpeakingTest1.js";

const SpeakingTests = () => {
  const [activeTest, setActiveTest] = useState(null);

  const speakingTests = [
    {
      id: "speaking-1",
      title: "IELTS Speaking Test 1",
      description: "General topics: Home, Hobbies, Role Models",
      difficulty: "Intermediate",
      duration: 15, // 11-14 minutes typical
      parts: 3,
      topics: ["Daily Life", "Personal Experience", "Abstract Discussion"],
      bestScore: null,
      attempts: 0,
      component: SpeakingTest1,
    },
  ];

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

  const handleStartTest = (testId) => {
    const test = speakingTests.find((t) => t.id === testId);
    if (test && test.component) {
      setActiveTest(test);
    } else {
      alert("Test chưa sẵn sàng!");
    }
  };

  const handleTestComplete = (results) => {
    console.log("Test completed:", results);
    // You can save to database here later
  };

  const handleExitTest = () => {
    setActiveTest(null);
  };

  // If a test is active, render the test component
  if (activeTest) {
    const TestComponent = activeTest.component;
    return (
      <div>
        <button
          onClick={handleExitTest}
          className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Tests
        </button>
        <TestComponent
          onComplete={handleTestComplete}
          onExit={handleExitTest}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          IELTS Speaking Tests 🎤
        </h2>
        <p className="text-gray-600">
          Luyện tập kỹ năng nói với các bài test theo chuẩn IELTS. Mỗi bài test
          gồm 3 phần trong 11-14 phút.
        </p>
      </div>

      {/* Info Banner */}
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

      {/* Stats Overview */}
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
              <p className="text-sm font-medium text-gray-600">Best Score</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.max(
                  ...speakingTests
                    .filter((t) => t.bestScore)
                    .map((t) => t.bestScore)
                ) || "N/A"}
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
                {speakingTests.filter((t) => t.attempts > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="space-y-6">
        {speakingTests.map((test) => (
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
                  {test.bestScore && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Best: {test.bestScore}
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
