// src/components/ielts/ReadingTests.js
import { useState, Suspense } from "react";
import { BookOpen, Clock, Award, Play, ArrowLeft } from "lucide-react";
import { readingTests } from "../../data/tests";
import { useTestResults } from "../../hooks/useTestResults";

const ReadingTests = () => {
  const [activeTest, setActiveTest] = useState(null);
  const [TestComponent, setTestComponent] = useState(null);
  const { tests, totalCompleted, averageBand, loading } =
    useTestResults("reading");

  // Merge database results with test definitions
  const testsWithStats = readingTests.map((test) => {
    const stats = tests.find((t) => t.test_number === test.test_number);
    return {
      ...test,
      attempts: stats?.attempts || 0,
      bestScore: stats?.best_band || null,
      bestRawScore: stats?.best_score || null,
      timeTaken: stats?.time_taken || null,
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

  const formatTime = (seconds) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
          IELTS Reading Tests
        </h2>
        <p className="text-gray-600">
          Luyện tập kỹ năng đọc hiểu với các bài test theo chuẩn IELTS. Mỗi bài
          test gồm 3 đoạn văn và 40 câu hỏi trong 60 phút.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Available Tests
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {readingTests.length}
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
              <p className="text-sm font-medium text-gray-600">Average Band</p>
              <p className="text-2xl font-semibold text-gray-900">
                {loading ? "..." : averageBand || "N/A"}
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {test.title}
                </h3>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      test.difficulty
                    )}`}
                  >
                    {test.difficulty}
                  </span>
                  {test.bestScore && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Best: Band {test.bestScore} ({test.bestRawScore}/40)
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
                    <BookOpen className="h-4 w-4" />
                    <span>{test.passages} đoạn văn</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{test.questions} câu hỏi</span>
                  </div>
                  {test.timeTaken && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Best time: {formatTime(test.timeTaken)}</span>
                    </div>
                  )}
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
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
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

export default ReadingTests;
