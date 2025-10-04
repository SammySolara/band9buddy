// src/components/ielts/ListeningTest5.js
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
import section1audio from "../../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-05-Section1.mp3";
import section2audio from "../../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-05-Section2.mp3";
import section3audio from "../../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-05-Section3.mp3";
import section4audio from "../../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-05-Section4.mp3";
// TODO: Import image
import repairScheduleImage from "../../../../assets/IELTS-Practice-Test-05-Section2.jpg";

const TOTAL_TIME = 2400; // 40 minutes in seconds

const ListeningTest5 = ({ onComplete, onExit }) => {
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

  // ANSWER KEY - TODO: Fill in correct answers
  const answerKey = {
    1: "equipment",
    2: "Fred",
    3: "6 days",
    4: "Mike",
    5: "Leo",
    6: "c",
    7: "a",
    8: "c",
    9: "b",
    10: "c",
    11: "e",
    12: "a",
    13: "d",
    14: "f",
    15: "c",
    16: "yellow",
    17: "garden shed",
    18: "wildlife reserve",
    19: "firewood",
    20: "garden bin",
    21: "Welfare State",
    22: "too long",
    23: "In Perspective",
    24: "oversimplifies",
    25: "Political Theory",
    26: "not relevant",
    27: "c",
    28: "s",
    29: "p",
    30: "p",
    31: "c",
    32: "c",
    33: "c",
    34: "b",
    35: "e",
    36: "participate",
    37: "natural springs",
    38: "local product",
    39: "characterised",
    40: "mature cheeses",
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
            test_number: 5,
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
          Complete the notes. Write NO MORE THAN TWO WORDS AND/OR NUMBERS for
          each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold text-lg mb-4">Basic Details of Project</h4>
        <div className="space-y-3">
          <div>
            <strong>Example:</strong> Pre-phase
          </div>
          <div className="flex items-center gap-2">
            <span>involves selecting rooms &</span>
            <input
              type="text"
              value={answers[1] || ""}
              onChange={(e) => handleAnswerChange(1, e.target.value)}
              className="border rounded px-2 py-1 w-64"
              placeholder="Answer 1"
            />
          </div>
          <div className="mt-4">
            <strong>Phase 1:</strong>
          </div>
          <div>
            <span>time needed: 3 days</span>
          </div>
          <div className="flex items-center gap-2">
            <span>staff involved: Jenna, Marco, &</span>
            <input
              type="text"
              value={answers[2] || ""}
              onChange={(e) => handleAnswerChange(2, e.target.value)}
              className="border rounded px-2 py-1 w-64"
              placeholder="Answer 2"
            />
          </div>
          <div className="mt-4">
            <strong>Phase 2:</strong>
          </div>
          <div className="flex items-center gap-2">
            <span>time needed:</span>
            <input
              type="text"
              value={answers[3] || ""}
              onChange={(e) => handleAnswerChange(3, e.target.value)}
              className="border rounded px-2 py-1 w-64"
              placeholder="Answer 3"
            />
          </div>
          <div className="flex items-center gap-2">
            <span>staff involved:</span>
            <input
              type="text"
              value={answers[4] || ""}
              onChange={(e) => handleAnswerChange(4, e.target.value)}
              className="border rounded px-2 py-1 w-64"
              placeholder="Answer 4"
            />
            <span>, with assistance from</span>
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
          Choose the correct letter, A, B, or C.
        </p>
      </div>
      <div className="space-y-4">
        {[
          {
            q: 6,
            text: "The main form of data collection will be",
            options: [
              "questionnaires.",
              "Internet polling.",
              "face-to-face interviews.",
            ],
          },
          {
            q: 7,
            text: "To finish in time, the staff will have to",
            options: ["work late.", "come in early.", "take some work home."],
          },
          {
            q: 8,
            text: "The final report will contain",
            options: [
              "three appendices.",
              "material from the company website.",
              "a supplementary booklet.",
            ],
          },
          {
            q: 9,
            text: "The final report will be handed in on the",
            options: ["5th.", "15th.", "25th."],
          },
          {
            q: 10,
            text: "At the end, there will be",
            options: [
              "an office party.",
              "a restaurant dinner.",
              "presents for all involved.",
            ],
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
    </div>
  );

  const renderSection2 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 11-15</h3>
        <p className="text-blue-800 text-sm">
          Complete the repair schedule. Write the correct letter, A-F, for each
          answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold text-lg mb-4">Problems to Fix</h4>
        <div className="space-y-2 text-sm mb-4">
          <p>
            <strong>A</strong> Birds in ceiling
          </p>
          <p>
            <strong>B</strong> Broken windows
          </p>
          <p>
            <strong>C</strong> Electrical fault
          </p>
          <p>
            <strong>D</strong> Fallen tree
          </p>
          <p>
            <strong>E</strong> Leaking roof
          </p>
          <p>
            <strong>F</strong> Staining on walls
          </p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg border mb-4">
        <div className="bg-gray-200 h-64 flex items-center justify-center">
          <img
            src={repairScheduleImage}
            alt="Schedule of repairs image"
            className="w-full max-w-2xl mx-auto"
          />
        </div>
      </div>
      <div className="space-y-3">
        {[11, 12, 13, 14, 15].map((q) => (
          <div
            key={q}
            className="bg-white p-4 rounded-lg border flex items-center gap-4"
          >
            <span className="font-semibold">{q}.</span>
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
        <h3 className="font-semibold text-blue-900 mb-2">Questions 16-20</h3>
        <p className="text-blue-800 text-sm">
          Complete the sentences. Write NO MORE THAN TWO WORDS for each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold text-lg mb-4">
          Additional Details Concerning Repairs
        </h4>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span>The stained walls will be painted</span>
            <input
              type="text"
              value={answers[16] || ""}
              onChange={(e) => handleAnswerChange(16, e.target.value)}
              className="border rounded px-2 py-1 w-48"
              placeholder="16"
            />
          </div>
          <div className="flex items-center gap-2">
            <span>Extra paint will be left in the</span>
            <input
              type="text"
              value={answers[17] || ""}
              onChange={(e) => handleAnswerChange(17, e.target.value)}
              className="border rounded px-2 py-1 w-48"
              placeholder="17"
            />
          </div>
          <div className="flex items-center gap-2">
            <span>The baby birds will be given to a</span>
            <input
              type="text"
              value={answers[18] || ""}
              onChange={(e) => handleAnswerChange(18, e.target.value)}
              className="border rounded px-2 py-1 w-48"
              placeholder="18"
            />
          </div>
          <div className="flex items-center gap-2">
            <span>The fallen tree will be used as</span>
            <input
              type="text"
              value={answers[19] || ""}
              onChange={(e) => handleAnswerChange(19, e.target.value)}
              className="border rounded px-2 py-1 w-48"
              placeholder="19"
            />
          </div>
          <div className="flex items-center gap-2">
            <span>The smaller parts of the tree will be put in a</span>
            <input
              type="text"
              value={answers[20] || ""}
              onChange={(e) => handleAnswerChange(20, e.target.value)}
              className="border rounded px-2 py-1 w-48"
              placeholder="20"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection3 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 21-26</h3>
        <p className="text-blue-800 text-sm">
          Complete the table. Write NO MORE THAN TWO WORDS for each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Subject</th>
              <th className="text-left py-2">Textbook Used</th>
              <th className="text-left py-2">Criticism of this book</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Social History</td>
              <td className="py-2">
                <input
                  type="text"
                  value={answers[21] || ""}
                  onChange={(e) => handleAnswerChange(21, e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  placeholder="21"
                />
              </td>
              <td className="py-2">
                It is{" "}
                <input
                  type="text"
                  value={answers[22] || ""}
                  onChange={(e) => handleAnswerChange(22, e.target.value)}
                  className="border rounded px-2 py-1 w-32"
                  placeholder="22"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Cultural Studies</td>
              <td className="py-2">
                <input
                  type="text"
                  value={answers[23] || ""}
                  onChange={(e) => handleAnswerChange(23, e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  placeholder="23"
                />
              </td>
              <td className="py-2">
                It{" "}
                <input
                  type="text"
                  value={answers[24] || ""}
                  onChange={(e) => handleAnswerChange(24, e.target.value)}
                  className="border rounded px-2 py-1 w-32"
                  placeholder="24"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2">
                <input
                  type="text"
                  value={answers[25] || ""}
                  onChange={(e) => handleAnswerChange(25, e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  placeholder="25"
                />
              </td>
              <td className="py-2">Government in Action</td>
              <td className="py-2">
                It is{" "}
                <input
                  type="text"
                  value={answers[26] || ""}
                  onChange={(e) => handleAnswerChange(26, e.target.value)}
                  className="border rounded px-2 py-1 w-32"
                  placeholder="26"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 27-30</h3>
        <p className="text-blue-800 text-sm">
          Choose the correct letter, S, C, or P. NB You may use a letter more
          than once.
        </p>
        <div className="mt-2 text-sm">
          <p>
            <strong>S</strong> Social History
          </p>
          <p>
            <strong>C</strong> Cultural Studies
          </p>
          <p>
            <strong>P</strong> Political Theory
          </p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold mb-4">
          What are the speakers' favorite subjects?
        </h4>
        <div className="space-y-3">
          {[
            { q: 27, name: "Steve" },
            { q: 28, name: "David" },
            { q: 29, name: "Susan" },
            { q: 30, name: "Olive" },
          ].map(({ q, name }) => (
            <div key={q} className="flex items-center gap-4">
              <span className="font-semibold w-32">
                {q}. {name}
              </span>
              <input
                type="text"
                value={answers[q] || ""}
                onChange={(e) => handleAnswerChange(q, e.target.value)}
                className="border rounded px-2 py-1 w-20"
                placeholder="S/C/P"
                maxLength={1}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSection4 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 31-32</h3>
        <p className="text-blue-800 text-sm">
          Choose the correct letter, A, B, or C.
        </p>
      </div>
      <div className="space-y-4">
        {[
          {
            q: 31,
            text: "Originally, country",
            options: [
              "required fewer workers.",
              "had lots of animals.",
              "were more interesting places.",
            ],
          },
          {
            q: 32,
            text: "Now, the problems there",
            options: ["can be solved.", "are numerous.", "are expected."],
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
        <h3 className="font-semibold text-blue-900 mb-2">Questions 33-35</h3>
        <p className="text-blue-800 text-sm">
          Choose THREE answers from the list and write the correct letter, A-F,
          next to the questions 33-35.
        </p>
        <p className="text-blue-800 text-sm mt-2">
          Which THREE factors are typical of modern farming?
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <div className="mb-4 space-y-1 text-sm">
          <p>
            <strong>A</strong> Many overheads
          </p>
          <p>
            <strong>B</strong> More machines
          </p>
          <p>
            <strong>C</strong> Fewer types of products
          </p>
          <p>
            <strong>D</strong> More frequent feeding
          </p>
          <p>
            <strong>E</strong> Greater numbers of products
          </p>
          <p>
            <strong>F</strong> More factories
          </p>
        </div>
        <div className="space-y-3">
          {[33, 34, 35].map((q) => (
            <div key={q} className="flex items-center gap-4">
              <span className="font-semibold">{q}.</span>
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
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 36-40</h3>
        <p className="text-blue-800 text-sm">
          Complete the table. Write NO MORE THAN TWO WORDS for each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Possible Solution</th>
              <th className="text-left py-2">Important Factor</th>
              <th className="text-left py-2">Examples</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">tourism</td>
              <td className="py-2">
                Locals must{" "}
                <input
                  type="text"
                  value={answers[36] || ""}
                  onChange={(e) => handleAnswerChange(36, e.target.value)}
                  className="border rounded px-2 py-1 w-32"
                  placeholder="36"
                />
              </td>
              <td className="py-2">
                Daylesford area uses its{" "}
                <input
                  type="text"
                  value={answers[37] || ""}
                  onChange={(e) => handleAnswerChange(37, e.target.value)}
                  className="border rounded px-2 py-1 w-32"
                  placeholder="37"
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2">
                using the{" "}
                <input
                  type="text"
                  value={answers[38] || ""}
                  onChange={(e) => handleAnswerChange(38, e.target.value)}
                  className="border rounded px-2 py-1 w-32"
                  placeholder="38"
                />
              </td>
              <td className="py-2">
                – is{" "}
                <input
                  type="text"
                  value={answers[39] || ""}
                  onChange={(e) => handleAnswerChange(39, e.target.value)}
                  className="border rounded px-2 py-1 w-32"
                  placeholder="39"
                />{" "}
                by its distinctive product
                <br />– must market the idea effectively
              </td>
              <td className="py-2">
                Shepparton is known for its{" "}
                <input
                  type="text"
                  value={answers[40] || ""}
                  onChange={(e) => handleAnswerChange(40, e.target.value)}
                  className="border rounded px-2 py-1 w-32"
                  placeholder="40"
                />
              </td>
            </tr>
          </tbody>
        </table>
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
            IELTS Listening Test 5 - Section {currentSection}
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

export default ListeningTest5;
