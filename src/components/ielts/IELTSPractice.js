// src/components/ielts/IELTSPractice.js
import { useNavigate } from "react-router-dom";
import { BookOpen, Headphones, PenTool, Mic } from "lucide-react";
import { useTestResults } from "../../hooks/useTestResults";

const IELTSPractice = () => {
  const navigate = useNavigate();

  // Get stats for all test types
  const { averageBand: readingBand, loading: readingLoading } =
    useTestResults("reading");
  const { averageBand: listeningBand, loading: listeningLoading } =
    useTestResults("listening");
  const { averageScore: writingScore, loading: writingLoading } =
    useTestResults("writing");
  const { averageScore: speakingScore, loading: speakingLoading } =
    useTestResults("speaking");

  const practiceTypes = [
    {
      id: "reading",
      icon: BookOpen,
      title: "Reading Tests",
      description: "Luyện tập kỹ năng đọc hiểu IELTS",
      color: "bg-blue-500",
      path: "/dashboard/ielts/reading",
    },
    {
      id: "listening",
      icon: Headphones,
      title: "Listening Tests",
      description: "Luyện tập kỹ năng nghe IELTS",
      color: "bg-green-500",
      path: "/dashboard/ielts/listening",
    },
    {
      id: "writing",
      icon: PenTool,
      title: "Writing Tests",
      description: "Luyện tập kỹ năng viết IELTS",
      color: "bg-purple-500",
      path: "/dashboard/ielts/writing",
    },
    {
      id: "speaking",
      icon: Mic,
      title: "Speaking Tests",
      description: "Luyện tập kỹ năng nói IELTS",
      color: "bg-orange-500",
      path: "/dashboard/ielts/speaking",
    },
  ];

  const handlePracticeClick = (practice) => {
    navigate(practice.path);
  };

  const statsData = [
    {
      icon: BookOpen,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      label: "Reading Avg Band",
      value: readingLoading ? "..." : readingBand || "N/A",
    },
    {
      icon: Headphones,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      label: "Listening Avg Band",
      value: listeningLoading ? "..." : listeningBand || "N/A",
    },
    {
      icon: PenTool,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      label: "Writing Avg Words",
      value: writingLoading
        ? "..."
        : writingScore
        ? Math.round(writingScore)
        : "N/A",
    },
    {
      icon: Mic,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      label: "Speaking Avg Rating",
      value: speakingLoading
        ? "..."
        : speakingScore
        ? `${speakingScore.toFixed(1)}/5`
        : "N/A",
    },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          IELTS Practice 📚
        </h2>
        <p className="text-gray-600">
          Chọn phần thi bạn muốn luyện tập. Mỗi phần được thiết kế theo chuẩn
          IELTS thực tế.
        </p>
      </div>

      {/* Practice Types Grid - Now 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {practiceTypes.map((practice) => {
          const IconComponent = practice.icon;
          return (
            <div key={practice.id} className="group">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 h-full">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 ${practice.color} rounded-lg text-white mb-6`}
                >
                  <IconComponent className="h-8 w-8" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {practice.title}
                </h3>

                <p className="text-gray-600 mb-6">{practice.description}</p>

                <button
                  onClick={() => handlePracticeClick(practice)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Bắt đầu luyện tập
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Thống kê luyện tập
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                    <IconComponent className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IELTSPractice;
