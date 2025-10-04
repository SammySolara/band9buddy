// src/components/ielts/ListeningTest4.js
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  Play,
  Pause,
  Volume2,
  Clock,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
// TODO: Import audio files
import section1audio from "../../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-04-Section1.mp3";
import section2audio from "../../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-04-Section2.mp3";
import section3audio from "../../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-04-Section3.mp3";
import section4audio from "../../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-04-Section4.mp3";
// TODO: Import images
import floorPlanImage from "../../../../assets/IELTS-Practice-Test-04-Section2.jpg";
import timeTableImage from "../../../../assets/IELTS-Practice-Test-04-Section2-task2.jpg"
import neutrinoImage from "../../../../assets/IELTS-Practice-Test-04-Section4.jpg";

const TOTAL_TIME = 2400; // 40 minutes in seconds

const ListeningTest4 = ({ onComplete, onExit }) => {
  const { user, session } = useAuth();

  const [currentSection, setCurrentSection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // ANSWER KEY
  const answerKey = {
    1: "10:25",
    2: "Box Hill",
    3: "30 to 39",
    4: "domestic duties",
    5: "married no children",
    6: "walking",
    7: "tighten",
    8: "hike",
    9: "swimming",
    10: "energy",
    11: "a",
    12: "e",
    13: "d",
    14: "f",
    15: "c",
    16: "b",
    17: "a",
    18: "c",
    19: "i",
    20: "f",
    21: "symbols",
    22: "interpret",
    23: "nature",
    24: "headings",
    25: "Legal",
    26: "procedures",
    27: "associated",
    28: "directions",
    29: "notes",
    30: "headings",
    31: "billion",
    32: "clean room",
    33: "radiation",
    34: "deep underground",
    35: "complex",
    36: "heavy water",
    37: "electronic",
    38: "1000 tons",
    39: "electric current",
    40: "control",
  };

  const audioFiles = {
    1: section1audio, // section1audio,
    2: section2audio, // section2audio,
    3: section3audio, // section3audio,
    4: section4audio, // section4audio,
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(timerRef.current);
      handleSubmit();
    }
  }, [timeLeft]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleLoadedMetadata = () => setDuration(audio.duration);

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [currentSection]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentSection]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionNum, value) => {
    setAnswers({ ...answers, [questionNum]: value });
  };

  const calculateBandScore = (correct) => {
    if (correct >= 39) return 9.0;
    if (correct >= 37) return 8.5;
    if (correct >= 35) return 8.0;
    if (correct >= 32) return 7.5;
    if (correct >= 30) return 7.0;
    if (correct >= 26) return 6.5;
    if (correct >= 23) return 6.0;
    if (correct >= 18) return 5.5;
    if (correct >= 16) return 5.0;
    if (correct >= 13) return 4.5;
    if (correct >= 10) return 4.0;
    return 3.5;
  };

  const handleSubmit = async () => {
    if (audioRef.current) audioRef.current.pause();
    clearInterval(timerRef.current);

    let correct = 0;
    Object.keys(answerKey).forEach((key) => {
      if (
        answers[key]?.toLowerCase().trim() ===
        answerKey[key]?.toLowerCase().trim()
      ) {
        correct++;
      }
    });

    const band = calculateBandScore(correct);
    const completedTime = TOTAL_TIME - timeLeft;

    const resultDetails = { correct, total: 40, band, completedTime };
    setResultsData(resultDetails);
    setShowResults(true);

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
            test_type: "listening",
            test_number: 4,
            completed_at: new Date().toISOString(),
            time_taken_seconds: completedTime,
            status: "completed",
            score: correct,
            total_questions: 40,
            band_score: band,
            answers: answers,
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

    if (onComplete) onComplete(resultDetails);
  };

  const renderSection1 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 1-5</h3>
        <p className="text-blue-800 text-sm">
          Complete the form. Write NO MORE THAN THREE WORDS OR NUMBERS for each
          answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold text-lg mb-4">Survey Form</h4>
        <div className="space-y-3">
          <div>
            <strong>Dealing with:</strong> exercise (Example)
          </div>
          <div className="flex items-center gap-2">
            <strong>Time contacted:</strong>
            <input
              type="text"
              value={answers[1] || ""}
              onChange={(e) => handleAnswerChange(1, e.target.value)}
              className="border rounded px-2 py-1 w-64"
              placeholder="Answer 1"
            />
          </div>
          <div className="flex items-center gap-2">
            <strong>Suburb:</strong>
            <input
              type="text"
              value={answers[2] || ""}
              onChange={(e) => handleAnswerChange(2, e.target.value)}
              className="border rounded px-2 py-1 w-64"
              placeholder="Answer 2"
            />
          </div>
          <div className="flex items-center gap-2">
            <strong>Age Group:</strong>
            <input
              type="text"
              value={answers[3] || ""}
              onChange={(e) => handleAnswerChange(3, e.target.value)}
              className="border rounded px-2 py-1 w-64"
              placeholder="Answer 3"
            />
          </div>
          <div className="flex items-center gap-2">
            <strong>Occupation:</strong>
            <input
              type="text"
              value={answers[4] || ""}
              onChange={(e) => handleAnswerChange(4, e.target.value)}
              className="border rounded px-2 py-1 w-64"
              placeholder="Answer 4"
            />
          </div>
          <div className="flex items-center gap-2">
            <strong>Family:</strong>
            <input
              type="text"
              value={answers[5] || ""}
              onChange={(e) => handleAnswerChange(5, e.target.value)}
              className="border rounded px-2 py-1 w-64"
              placeholder="Answer 5"
            />
          </div>
        </div>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 6-10</h3>
        <p className="text-blue-800 text-sm">
          Complete the summary. Write ONE WORD ONLY for each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <p className="mb-4">
          The subject undertakes exercise by regularly{" "}
          <input
            type="text"
            value={answers[6] || ""}
            onChange={(e) => handleAnswerChange(6, e.target.value)}
            className="border rounded px-2 py-1 w-32 mx-1"
            placeholder="6"
          />
          . She does yoga in order to relax and{" "}
          <input
            type="text"
            value={answers[7] || ""}
            onChange={(e) => handleAnswerChange(7, e.target.value)}
            className="border rounded px-2 py-1 w-32 mx-1"
            placeholder="7"
          />{" "}
          her muscles. When she was younger, she would{" "}
          <input
            type="text"
            value={answers[8] || ""}
            onChange={(e) => handleAnswerChange(8, e.target.value)}
            className="border rounded px-2 py-1 w-32 mx-1"
            placeholder="8"
          />
          , and in the future, she may go{" "}
          <input
            type="text"
            value={answers[9] || ""}
            onChange={(e) => handleAnswerChange(9, e.target.value)}
            className="border rounded px-2 py-1 w-32 mx-1"
            placeholder="9"
          />{" "}
          although that will depend on whether she has enough{" "}
          <input
            type="text"
            value={answers[10] || ""}
            onChange={(e) => handleAnswerChange(10, e.target.value)}
            className="border rounded px-2 py-1 w-32 mx-1"
            placeholder="10"
          />
          .
        </p>
      </div>
    </div>
  );

  const renderSection2 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 11-16</h3>
        <p className="text-blue-800 text-sm">
          Label the floor plan. Write the correct letter, A-F, for each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border mb-4">
        <img
          src={floorPlanImage}
          alt="Library Floor Plan"
          className="w-full max-w-2xl mx-auto"
        />
      </div>
      <div className="space-y-3">
        {[
          { q: 11, text: "Quiet reading" },
          { q: 12, text: "Computers" },
          { q: 13, text: "Newspapers & magazines" },
          { q: 14, text: "Reference books" },
          { q: 15, text: "Audio section" },
          { q: 16, text: "Main library" },
        ].map(({ q, text }) => (
          <div
            key={q}
            className="bg-white p-4 rounded-lg border flex items-center gap-4"
          >
            <span className="font-semibold">
              {q}. {text}
            </span>
            <input
              type="text"
              value={answers[q] || ""}
              onChange={(e) => handleAnswerChange(q, e.target.value)}
              className="border rounded px-2 py-1 w-20"
              placeholder="A-F"
              maxLength={1}
            />
          </div>
        ))}
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 17-20</h3>
        <p className="text-blue-800 text-sm">
          Complete the timetable. Write the correct letter, A-J, for each
          answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold text-lg mb-4 text-center">
          ILC Special Sessions Timetable
        </h4>
        <img
          src={timeTableImage}
          alt="ILC Special Sessions Timetable"
          className="w-full max-w-2xl mx-auto"
        />
        <table className="w-full mb-4">
          <tbody>
            <tr className="border-b">
              <td className="py-2 font-semibold">17. Teacher-led discussion</td>
              <td className="py-2">
                <input
                  type="text"
                  value={answers[17] || ""}
                  onChange={(e) => handleAnswerChange(17, e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                  placeholder="17"
                  maxLength={1}
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-semibold">18. Writing skills</td>
              <td className="py-2">
                <input
                  type="text"
                  value={answers[18] || ""}
                  onChange={(e) => handleAnswerChange(18, e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                  placeholder="18"
                  maxLength={1}
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-semibold">19. On-call teacher</td>
              <td className="py-2">
                <input
                  type="text"
                  value={answers[19] || ""}
                  onChange={(e) => handleAnswerChange(19, e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                  placeholder="19"
                  maxLength={1}
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-semibold">20. Language exchange</td>
              <td className="py-2">
                <input
                  type="text"
                  value={answers[20] || ""}
                  onChange={(e) => handleAnswerChange(20, e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                  placeholder="20"
                  maxLength={1}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSection3 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 21-24</h3>
        <p className="text-blue-800 text-sm">
          Complete the summary. Write ONE WORD ONLY for each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <p className="mb-4">
          One of the basic strategies when listening to lectures is to use{" "}
          <input
            type="text"
            value={answers[21] || ""}
            onChange={(e) => handleAnswerChange(21, e.target.value)}
            className="border rounded px-2 py-1 w-40 mx-1"
            placeholder="21"
          />
          . This saves time, but it is only effective if they can be{" "}
          <input
            type="text"
            value={answers[22] || ""}
            onChange={(e) => handleAnswerChange(22, e.target.value)}
            className="border rounded px-2 py-1 w-40 mx-1"
            placeholder="22"
          />{" "}
          later. More generally, it is necessary to format the page in
          anticipation of the{" "}
          <input
            type="text"
            value={answers[23] || ""}
            onChange={(e) => handleAnswerChange(23, e.target.value)}
            className="border rounded px-2 py-1 w-40 mx-1"
            placeholder="23"
          />{" "}
          of the lecture. As an example, one can draw{" "}
          <input
            type="text"
            value={answers[24] || ""}
            onChange={(e) => handleAnswerChange(24, e.target.value)}
            className="border rounded px-2 py-1 w-40 mx-1"
            placeholder="24"
          />
          , tables, and flowcharts, consistent with the way the subject matter
          is presented.
        </p>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 25-30</h3>
        <p className="text-blue-800 text-sm">
          Complete the table. Write ONE WORD ONLY for each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Subject</th>
              <th className="text-left py-2">Recommended Page Design</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">
                <input
                  type="text"
                  value={answers[25] || ""}
                  onChange={(e) => handleAnswerChange(25, e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  placeholder="25"
                />{" "}
                Studies
              </td>
              <td className="py-2">
                flowchart, showing courtroom processes and{" "}
                <input
                  type="text"
                  value={answers[26] || ""}
                  onChange={(e) => handleAnswerChange(26, e.target.value)}
                  className="border rounded px-2 py-1 w-40"
                  placeholder="26"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Culture Studies</td>
              <td className="py-2">
                table or spider graph, linking{" "}
                <input
                  type="text"
                  value={answers[27] || ""}
                  onChange={(e) => handleAnswerChange(27, e.target.value)}
                  className="border rounded px-2 py-1 w-40"
                  placeholder="27"
                />{" "}
                thoughts etc.
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Management Theory</td>
              <td className="py-2">
                network (like spider graph but has{" "}
                <input
                  type="text"
                  value={answers[28] || ""}
                  onChange={(e) => handleAnswerChange(28, e.target.value)}
                  className="border rounded px-2 py-1 w-40"
                  placeholder="28"
                />
                )
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Political Science</td>
              <td className="py-2">
                linear{" "}
                <input
                  type="text"
                  value={answers[29] || ""}
                  onChange={(e) => handleAnswerChange(29, e.target.value)}
                  className="border rounded px-2 py-1 w-40"
                  placeholder="29"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2">Mass Media</td>
              <td className="py-2">
                just use{" "}
                <input
                  type="text"
                  value={answers[30] || ""}
                  onChange={(e) => handleAnswerChange(30, e.target.value)}
                  className="border rounded px-2 py-1 w-40"
                  placeholder="30"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSection4 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 31-35</h3>
        <p className="text-blue-800 text-sm">
          Complete the notes. Write NO MORE THAN TWO WORDS for each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold text-lg mb-4">Neutrinos</h4>
        <div className="space-y-4">
          <div>
            <p className="font-semibold mb-2">are everywhere</p>
            <p className="ml-4">
              → 100 to 200{" "}
              <input
                type="text"
                value={answers[31] || ""}
                onChange={(e) => handleAnswerChange(31, e.target.value)}
                className="border rounded px-2 py-1 w-48 mx-1"
                placeholder="31"
              />{" "}
              pass through our bodies every second.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2">
              are difficult to detect because of
            </p>
            <div className="ml-4 space-y-2">
              <p>
                1. the presence of other particles
                <br />→ usually need a{" "}
                <input
                  type="text"
                  value={answers[32] || ""}
                  onChange={(e) => handleAnswerChange(32, e.target.value)}
                  className="border rounded px-2 py-1 w-48 mx-1"
                  placeholder="32"
                />
              </p>
              <p>
                2. the surrounding{" "}
                <input
                  type="text"
                  value={answers[33] || ""}
                  onChange={(e) => handleAnswerChange(33, e.target.value)}
                  className="border rounded px-2 py-1 w-48 mx-1"
                  placeholder="33"
                />
                <br />→ detection location usually{" "}
                <input
                  type="text"
                  value={answers[34] || ""}
                  onChange={(e) => handleAnswerChange(34, e.target.value)}
                  className="border rounded px-2 py-1 w-48 mx-1"
                  placeholder="34"
                />
              </p>
              <p>
                3. challenge of installing equipment
                <br />→ engineering is very{" "}
                <input
                  type="text"
                  value={answers[35] || ""}
                  onChange={(e) => handleAnswerChange(35, e.target.value)}
                  className="border rounded px-2 py-1 w-48 mx-1"
                  placeholder="35"
                />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 36-40</h3>
        <p className="text-blue-800 text-sm">
          Complete the diagram. Write NO MORE THAN TWO WORDS AND/OR NUMBERS for
          each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        {/* TODO: Add neutrino detector diagram image */}
        <div className="bg-gray-200 h-96 flex items-center justify-center mb-4">
          <img
            src={neutrinoImage}
            alt="Neutrino Detector Diagram"
            className="w-full max-w-2xl mx-auto"
          />
        </div>
        <div className="space-y-3">
          {[36, 37, 38, 39, 40].map((q) => (
            <div
              key={q}
              className="bg-white p-4 rounded-lg border flex items-center gap-4"
            >
              <span className="font-semibold">{q}.</span>
              <input
                type="text"
                value={answers[q] || ""}
                onChange={(e) => handleAnswerChange(q, e.target.value)}
                className="border rounded px-2 py-1 flex-1"
                placeholder={`Answer ${q}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-4">Test Results</h2>

        <div className="grid grid-cols-3 gap-4 text-center mb-8 bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Score</p>
            <p className="text-2xl font-bold">
              {resultsData.correct} / {resultsData.total}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Band Score</p>
            <p className="text-2xl font-bold">{resultsData.band.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Time Taken</p>
            <p className="text-2xl font-bold">
              {formatTime(resultsData.completedTime)}
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Answer Review</h3>
        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
          {Object.keys(answerKey).map((key) => {
            const userAnswer = answers[key] || "";
            const correctAnswer = answerKey[key];
            const isCorrect =
              userAnswer.toLowerCase().trim() ===
              correctAnswer.toLowerCase().trim();

            return (
              <div
                key={key}
                className={`p-3 rounded-lg border ${
                  isCorrect
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center font-semibold">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  Question {key}
                </div>
                <div className="pl-7 mt-1 text-sm">
                  <p>
                    Your answer:{" "}
                    <span className="font-medium">
                      {userAnswer || (
                        <span className="text-gray-500">No Answer</span>
                      )}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p>
                      Correct answer:{" "}
                      <span className="font-medium text-green-700">
                        {correctAnswer}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onExit}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold mx-auto"
          >
            <ArrowLeft className="h-5 w-5" /> Back to All Tests
          </button>
        </div>
      </div>
    );
  };

  const renderTest = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            IELTS Listening Test 4 - Section {currentSection}
          </h2>
          <div
            className={`flex items-center gap-2 font-semibold text-lg p-2 rounded-md ${
              timeLeft < 300 ? "text-red-600 bg-red-100" : "text-gray-700"
            }`}
          >
            <Clock className="h-5 w-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <audio
            ref={audioRef}
            src={audioFiles[currentSection]}
            onEnded={() => setIsPlaying(false)}
          />
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={togglePlayPause}
              className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-full"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Clock className="h-4 w-4" />
                <span>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
            </div>
            <Volume2 className="h-5 w-5 text-gray-600" />
          </div>
        </div>

        <div className="mb-6">
          {currentSection === 1 && renderSection1()}
          {currentSection === 2 && renderSection2()}
          {currentSection === 3 && renderSection3()}
          {currentSection === 4 && renderSection4()}
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <button
            onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
            disabled={currentSection === 1}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          {currentSection < 4 ? (
            <button
              onClick={() => setCurrentSection(currentSection + 1)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Next Section <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
            >
              <CheckCircle className="h-4 w-4" /> Submit Test
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {showResults ? renderResults() : renderTest()}
    </div>
  );
};

export default ListeningTest4;