// src/components/ielts/ListeningTest1.js
import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  Clock,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle, // For incorrect answers
  ArrowLeft, // For back button
} from "lucide-react";
import section1audio from "../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-01-Section1.mp3";
import section2audio from "../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-01-Section2.mp3";
import section3audio from "../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-01-Section3.mp3";
import section4audio from "../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-01-Section4.mp3";
import officePlanImage from "../../../assets/IELTS-Practice-Test-01-Section2.jpg";
import styleGuideImage from "../../../assets/IELTS-Practice-Test-01-Section3.jpg";

const TOTAL_TIME = 2400; // 40 minutes in seconds

const ListeningTest1 = ({ onComplete, onExit }) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [answers, setAnswers] = useState({});

  // FIX: Correctly destructure useState for showResults
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState(null);

  // NEW: State for the main test timer
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // ANSWER KEY
  const answerKey = {
    1: "Animal Park",
    2: "old and cloudy",
    3: "10:15 am",
    4: "Birds of Prey",
    5: "the reptile display",
    6: "6:30",
    7: "Chinese",
    8: "Japanese",
    9: "Koreans",
    10: "Thai",
    11: "B",
    12: "A",
    13: "B",
    14: "A",
    15: "A",
    16: "D",
    17: "E",
    18: "B",
    19: "C",
    20: "A",
    21: "G",
    22: "E",
    23: "C",
    24: "A",
    25: "header",
    26: "16",
    27: "12",
    28: "single",
    29: "work",
    30: "teacher's",
    31: "regulations",
    32: "grass",
    33: "development",
    34: "passive recreation",
    35: "get",
    36: "Industrial Revolution",
    37: "50000",
    38: "central lake",
    39: "refuge",
    40: "Melbourne",
  };

  const audioFiles = {
    1: section1audio,
    2: section2audio,
    3: section3audio,
    4: section4audio,
  };

  // NEW: Effect for the main test timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  // NEW: Effect to auto-submit when time runs out
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

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(timerRef.current);
      handleSubmit();
    }
  }, [timeLeft]);

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

  // UPDATED: handleSubmit to handle results and timing
  const handleSubmit = () => {
    // Stop the audio and the timer
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
    const completedTime = TOTAL_TIME - timeLeft; // Track completed time

    const resultDetails = { correct, total: 40, band, completedTime };
    setResultsData(resultDetails); // Store results data
    setShowResults(true); // Show the results screen

    // Pass data to parent component for DB saving later
    if (onComplete) onComplete(resultDetails);
  };

  // All renderSection functions remain the same as in your file...
  const renderSection1 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 1-6</h3>
        <p className="text-blue-800 text-sm">
          Complete the notes. Write NO MORE THAN THREE WORDS OR A NUMBER for
          each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold text-lg mb-4">School Excursion</h4>
        <div className="space-y-3">
          <div>
            <strong>Day:</strong> Wednesday (Example)
          </div>
          <div className="flex items-center gap-2">
            <strong>Destination:</strong>
            <input
              type="text"
              value={answers[1] || ""}
              onChange={(e) => handleAnswerChange(1, e.target.value)}
              className="border rounded px-2 py-1 w-64"
              placeholder="Answer 1"
            />
          </div>
          <div className="flex items-center gap-2">
            <strong>Weather:</strong>
            <input
              type="text"
              value={answers[2] || ""}
              onChange={(e) => handleAnswerChange(2, e.target.value)}
              className="border rounded px-2 py-1 w-64"
              placeholder="Answer 2"
            />
          </div>
          <div className="flex items-center gap-2">
            <strong>Arrival time:</strong>
            <input
              type="text"
              value={answers[3] || ""}
              onChange={(e) => handleAnswerChange(3, e.target.value)}
              className="border rounded px-2 py-1 w-64"
              placeholder="Answer 3"
            />
          </div>
          <div className="mt-4">
            <strong>Activities Planned</strong>
          </div>
          <div className="flex items-center gap-2">
            <strong>See:</strong>
            <input
              type="text"
              value={answers[4] || ""}
              onChange={(e) => handleAnswerChange(4, e.target.value)}
              className="border rounded px-2 py-1 w-64"
              placeholder="Answer 4"
            />
          </div>
          <div>
            <strong>Eat:</strong> Catered lunch
          </div>
          <div className="flex items-center gap-2">
            <strong>Attend:</strong>
            <input
              type="text"
              value={answers[5] || ""}
              onChange={(e) => handleAnswerChange(5, e.target.value)}
              className="border rounded px-2 py-1 w-64"
              placeholder="Answer 5"
            />
          </div>
          <div className="flex items-center gap-2">
            <strong>Return time:</strong>
            <input
              type="text"
              value={answers[6] || ""}
              onChange={(e) => handleAnswerChange(6, e.target.value)}
              className="border rounded px-2 py-1 w-64"
              placeholder="Answer 6"
            />
          </div>
        </div>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 7-10</h3>
        <p className="text-blue-800 text-sm">
          Complete the table. Write ONE WORD ONLY for each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Nationality</th>
              <th className="text-left py-2">%</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">
                <input
                  type="text"
                  value={answers[7] || ""}
                  onChange={(e) => handleAnswerChange(7, e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Answer 7"
                />
              </td>
              <td className="py-2">26</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">
                <input
                  type="text"
                  value={answers[8] || ""}
                  onChange={(e) => handleAnswerChange(8, e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Answer 8"
                />
              </td>
              <td className="py-2">25</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">
                <input
                  type="text"
                  value={answers[9] || ""}
                  onChange={(e) => handleAnswerChange(9, e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Answer 9"
                />
              </td>
              <td className="py-2">16</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Indonesian</td>
              <td className="py-2">15</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">
                <input
                  type="text"
                  value={answers[10] || ""}
                  onChange={(e) => handleAnswerChange(10, e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Answer 10"
                />
              </td>
              <td className="py-2">8</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Saudi</td>
              <td className="py-2">7</td>
            </tr>
            <tr>
              <td className="py-2">Other</td>
              <td className="py-2">3</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
  const renderSection2 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 11-15</h3>
        <p className="text-blue-800 text-sm">
          Choose the correct letter, A, B, or C.
        </p>
      </div>
      <div className="space-y-4">
        {[
          {
            q: 11,
            text: "The company deals mostly with:",
            options: ["Big cities", "Nature holidays", "Nepal"],
          },
          {
            q: 12,
            text: "The overseas consultants deal mostly with:",
            options: ["Asia", "North America", "Europe"],
          },
          {
            q: 13,
            text: "For deserts and gorges, customers should come in the:",
            options: ["Morning", "Afternoon", "Night"],
          },
          {
            q: 14,
            text: "Trips to regional locations are good because:",
            options: [
              "The buses are comfortable",
              "There is storage for suitcases",
              "They can be seen quickly",
            ],
          },
          {
            q: 15,
            text: "SleekLine buses are particularly known for their:",
            options: ["Service", "Size", "Comfort"],
          },
        ].map(({ q, text, options }) => (
          <div key={q} className="bg-white p-4 rounded-lg border">
            <p className="font-semibold mb-3">
              {q}. {text}
            </p>
            <div className="space-y-2">
              {options.map((opt, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`q${q}`}
                    value={String.fromCharCode(65 + idx)}
                    onChange={(e) => handleAnswerChange(q, e.target.value)}
                    checked={answers[q] === String.fromCharCode(65 + idx)}
                    className="w-4 h-4"
                  />
                  <span>
                    <strong>{String.fromCharCode(65 + idx)}</strong> {opt}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 16-20</h3>
        <p className="text-blue-800 text-sm">
          Identify the rooms in the office plan. Write the correct letter, A-G.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border mb-4">
        <img
          src={officePlanImage}
          alt="Office Plan"
          className="w-full max-w-2xl mx-auto"
        />
      </div>
      <div className="space-y-3">
        {[
          { q: 16, text: "Local Tours" },
          { q: 17, text: "Interstate Tours" },
          { q: 18, text: "International Tours" },
          { q: 19, text: "Asian Region" },
          { q: 20, text: "General Office" },
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
              placeholder="A-G"
              maxLength={1}
            />
          </div>
        ))}
      </div>
    </div>
  );
  const renderSection3 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 21-24</h3>
        <p className="text-blue-800 text-sm">
          Complete the timetable. Write the correct letter, A-H.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2"></th>
              <th className="text-left py-2">Morning</th>
              <th className="text-left py-2">Afternoon</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 font-semibold">Monday</td>
              <td className="py-2">Opening Lecture</td>
              <td className="py-2">
                <input
                  type="text"
                  value={answers[21] || ""}
                  onChange={(e) => handleAnswerChange(21, e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                  placeholder="21"
                  maxLength={1}
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-semibold">Tuesday</td>
              <td className="py-2">
                <input
                  type="text"
                  value={answers[22] || ""}
                  onChange={(e) => handleAnswerChange(22, e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                  placeholder="22"
                  maxLength={1}
                />
              </td>
              <td className="py-2">Study Skills</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-semibold">Wednesday</td>
              <td className="py-2">x</td>
              <td className="py-2">
                <input
                  type="text"
                  value={answers[23] || ""}
                  onChange={(e) => handleAnswerChange(23, e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                  placeholder="23"
                  maxLength={1}
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-semibold">Thursday</td>
              <td className="py-2">x</td>
              <td className="py-2">x</td>
            </tr>
            <tr>
              <td className="py-2 font-semibold">Friday</td>
              <td className="py-2">x</td>
              <td className="py-2">
                <input
                  type="text"
                  value={answers[24] || ""}
                  onChange={(e) => handleAnswerChange(24, e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                  placeholder="24"
                  maxLength={1}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="mt-4 text-sm space-y-1">
          <p>
            <strong>A</strong> BBQ
          </p>
          <p>
            <strong>B</strong> Careers lecture
          </p>
          <p>
            <strong>C</strong> Computer lab visit
          </p>
          <p>
            <strong>D</strong> Dance
          </p>
          <p>
            <strong>E</strong> Library tour
          </p>
          <p>
            <strong>F</strong> Student Union induction
          </p>
          <p>
            <strong>G</strong> University tour
          </p>
          <p>
            <strong>H</strong> Legal rights lecture
          </p>
        </div>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 25-30</h3>
        <p className="text-blue-800 text-sm">
          Complete the labels. Write ONE WORD OR A NUMBER for each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border mb-4">
        <img
          src={styleGuideImage}
          alt="University Style Guide"
          className="w-full max-w-2xl mx-auto"
        />
      </div>
      <div className="space-y-3">
        {[25, 26, 27, 28, 29, 30].map((q) => (
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
  );
  const renderSection4 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 31-34</h3>
        <p className="text-blue-800 text-sm">
          Complete the sentences. Write NO MORE THAN TWO WORDS for each answer.
        </p>
      </div>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg border">
          <p>
            Behavior in parks is controlled by{" "}
            <input
              type="text"
              value={answers[31] || ""}
              onChange={(e) => handleAnswerChange(31, e.target.value)}
              className="border rounded px-2 py-1 w-48 mx-1"
              placeholder="31"
            />
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p>
            Insect numbers are reduced by having{" "}
            <input
              type="text"
              value={answers[32] || ""}
              onChange={(e) => handleAnswerChange(32, e.target.value)}
              className="border rounded px-2 py-1 w-48 mx-1"
              placeholder="32"
            />
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p>
            A wilderness park does not have any{" "}
            <input
              type="text"
              value={answers[33] || ""}
              onChange={(e) => handleAnswerChange(33, e.target.value)}
              className="border rounded px-2 py-1 w-48 mx-1"
              placeholder="33"
            />
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p>
            Observing trees and lying in the grass are examples of{" "}
            <input
              type="text"
              value={answers[34] || ""}
              onChange={(e) => handleAnswerChange(34, e.target.value)}
              className="border rounded px-2 py-1 w-48 mx-1"
              placeholder="34"
            />
          </p>
        </div>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 35-40</h3>
        <p className="text-blue-800 text-sm">
          Complete the notes. Write NO MORE THAN TWO WORDS OR A NUMBER for each
          answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold text-lg mb-4">PARKS</h4>
        <div className="space-y-3">
          <p className="font-semibold">1000 years ago</p>
          <p>sufficient wilderness</p>
          <div className="flex items-center gap-2">
            <span>large forests: people could</span>
            <input
              type="text"
              value={answers[35] || ""}
              onChange={(e) => handleAnswerChange(35, e.target.value)}
              className="border rounded px-2 py-1 w-48"
              placeholder="35"
            />
          </div>
          <div className="flex items-center gap-2">
            <span>desire to preserve nature began with</span>
            <input
              type="text"
              value={answers[36] || ""}
              onChange={(e) => handleAnswerChange(36, e.target.value)}
              className="border rounded px-2 py-1 w-48"
              placeholder="36"
            />
          </div>
          <p className="font-semibold mt-4">Princes Park</p>
          <div className="flex items-center gap-2">
            <span>land originally worth £</span>
            <input
              type="text"
              value={answers[37] || ""}
              onChange={(e) => handleAnswerChange(37, e.target.value)}
              className="border rounded px-2 py-1 w-32"
              placeholder="37"
            />
          </div>
          <p>designed by Joseph Paxton</p>
          <div className="flex items-center gap-2">
            <span>in the middle was a</span>
            <input
              type="text"
              value={answers[38] || ""}
              onChange={(e) => handleAnswerChange(38, e.target.value)}
              className="border rounded px-2 py-1 w-48"
              placeholder="38"
            />
          </div>
          <p className="font-semibold mt-4">Neighborhood Parks</p>
          <div className="flex items-center gap-2">
            <span>now regarded as a</span>
            <input
              type="text"
              value={answers[39] || ""}
              onChange={(e) => handleAnswerChange(39, e.target.value)}
              className="border rounded px-2 py-1 w-48"
              placeholder="39"
            />
          </div>
          <p>satisfy a natural desire</p>
          <div className="flex items-center gap-2">
            <span>can be famous, e.g. in</span>
            <input
              type="text"
              value={answers[40] || ""}
              onChange={(e) => handleAnswerChange(40, e.target.value)}
              className="border rounded px-2 py-1 w-48"
              placeholder="40"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // NEW: Component for showing results screen
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
            onClick={onExit} // Go back to the main tests screen
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold mx-auto"
          >
            <ArrowLeft className="h-5 w-5" /> Back to All Tests
          </button>
        </div>
      </div>
    );
  };

  // NEW: Component for showing the active test
  const renderTest = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            IELTS Listening Test 1 - Section {currentSection}
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
      {/* Conditionally render the test or the results */}
      {showResults ? renderResults() : renderTest()}
    </div>
  );
};

export default ListeningTest1;
