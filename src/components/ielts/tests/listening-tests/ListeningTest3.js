// src/components/ielts/ListeningTest3.js
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
import section1audio from "../../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-03-Section1.mp3";
import section2audio from "../../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-03-Section2.mp3";
import section3audio from "../../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-03-Section3.mp3";
import section4audio from "../../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-03-Section4.mp3";

const TOTAL_TIME = 2400; // 40 minutes in seconds

const ListeningTest3 = ({ onComplete, onExit }) => {
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

  const answerKey = {
    1: "engineering",
    2: "car salesman",
    3: "playing chess",
    4: "electronics",
    5: "1200",
    6: "immediately",
    7: "Spanish",
    8: "E",
    9: "F",
    10: "G",
    11: "consultation",
    12: "diet",
    13: "test",
    14: "monthly",
    15: "three",
    16: "c",
    17: "a",
    18: "e",
    19: "f",
    20: "d",
    21: "b",
    22: "c",
    23: "a",
    24: "b",
    25: "c",
    26: "seven years",
    27: "M.B.P",
    28: "not stable",
    29: "bad attitude",
    30: "health problems",
    31: "c",
    32: "c",
    33: "a",
    34: "limestone",
    35: "solidifies",
    36: "fault lines",
    37: "calcium",
    38: "flowstone",
    39: "1986",
    40: "bottom up",
  };

  const audioFiles = {
    1: section1audio,
    2: section2audio,
    3: section3audio,
    4: section4audio,
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
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
      if (!session) throw new Error("No active session");
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
            test_number: 3,
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
        <h3 className="font-semibold text-blue-900 mb-2">Questions 1-7</h3>
        <p className="text-blue-800 text-sm">
          Complete the form. Write NO MORE THAN TWO WORDS OR A NUMBER for each
          answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold text-lg mb-4">Client Details</h4>
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded">
            <strong>Name:</strong>{" "}
            <span className="underline">Andrew Peterson</span>{" "}
            <span className="text-sm text-gray-600">(Example)</span>
          </div>
          <div className="flex items-start gap-2">
            <strong className="w-48">Educational Qualification:</strong>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={answers[1] || ""}
                  onChange={(e) => handleAnswerChange(1, e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Answer 1"
                />
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <strong className="w-48">Previous Job:</strong>
            <div className="flex-1">
              <input
                type="text"
                value={answers[2] || ""}
                onChange={(e) => handleAnswerChange(2, e.target.value)}
                className="border rounded px-2 py-1 w-full"
                placeholder="Answer 2"
              />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <strong className="w-48">Hobbies:</strong>
            <div className="flex-1">
              <input
                type="text"
                value={answers[3] || ""}
                onChange={(e) => handleAnswerChange(3, e.target.value)}
                className="border rounded px-2 py-1 w-full"
                placeholder="Answer 3"
              />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <strong className="w-48">Main Skills:</strong>
            <div className="flex-1">
              <input
                type="text"
                value={answers[4] || ""}
                onChange={(e) => handleAnswerChange(4, e.target.value)}
                className="border rounded px-2 py-1 w-full"
                placeholder="Answer 4"
              />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <strong className="w-48">Expected Salary ($):</strong>
            <div className="flex-1">
              <input
                type="text"
                value={answers[5] || ""}
                onChange={(e) => handleAnswerChange(5, e.target.value)}
                className="border rounded px-2 py-1 w-full"
                placeholder="Answer 5"
              />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <strong className="w-48">Can start:</strong>
            <div className="flex-1">
              <input
                type="text"
                value={answers[6] || ""}
                onChange={(e) => handleAnswerChange(6, e.target.value)}
                className="border rounded px-2 py-1 w-full"
                placeholder="Answer 6"
              />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <strong className="w-48">Other languages:</strong>
            <div className="flex-1">
              <input
                type="text"
                value={answers[7] || ""}
                onChange={(e) => handleAnswerChange(7, e.target.value)}
                className="border rounded px-2 py-1 w-full"
                placeholder="Answer 7"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 8-10</h3>
        <p className="text-blue-800 text-sm">
          Choose THREE letters from the list, A-G.
        </p>
        <p className="text-blue-800 text-sm mt-1">
          Which THREE qualities do employers most value in their staff?
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <div className="mb-4 space-y-2">
          <p>
            <strong>A</strong> Problem-solving skills
          </p>
          <p>
            <strong>B</strong> Diligence
          </p>
          <p>
            <strong>C</strong> Experience
          </p>
          <p>
            <strong>D</strong> Flexible hours
          </p>
          <p>
            <strong>E</strong> Independent thinking
          </p>
          <p>
            <strong>F</strong> Good personality
          </p>
          <p>
            <strong>G</strong> Qualifications
          </p>
        </div>
        <div className="space-y-3">
          {[8, 9, 10].map((q) => (
            <div key={q} className="flex items-center gap-4">
              <span className="font-semibold w-8">{q}.</span>
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
    </div>
  );

  const renderSection2 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 11-15</h3>
        <p className="text-blue-800 text-sm">
          Answer the questions. Write ONE WORD ONLY for each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <div className="space-y-4">
          {[
            { q: 11, text: "What does the centre provide first?" },
            { q: 12, text: "What is important to control?" },
            {
              q: 13,
              text: "What will be used to assess member's fitness level?",
            },
            { q: 14, text: "How often is the exercise schedule reviewed?" },
            { q: 15, text: "How many exercise programs are available?" },
          ].map(({ q, text }) => (
            <div key={q} className="flex items-start gap-2">
              <strong>{q}.</strong>
              <div className="flex-1">
                <p className="mb-2">{text}</p>
                <input
                  type="text"
                  value={answers[q] || ""}
                  onChange={(e) => handleAnswerChange(q, e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  placeholder={`Answer ${q}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 16-20</h3>
        <p className="text-blue-800 text-sm">
          Write the correct letter, A-G, next to the questions.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <div className="mb-4 space-y-1">
          <p>
            <strong>A</strong> jogging machines
          </p>
          <p>
            <strong>B</strong> Yoga studio
          </p>
          <p>
            <strong>C</strong> Weight units
          </p>
          <p>
            <strong>D</strong> Front-desk area
          </p>
          <p>
            <strong>E</strong> Squash courts
          </p>
          <p>
            <strong>F</strong> Shower blocks
          </p>
          <p>
            <strong>G</strong> Swimming pool
          </p>
        </div>
        <p className="font-semibold mb-3">Which place is best for:</p>
        <div className="space-y-3">
          {[
            { q: 16, text: "developing confidence?" },
            { q: 17, text: "reducing stress?" },
            { q: 18, text: "building fitness?" },
            { q: 19, text: "meeting others?" },
            { q: 20, text: "finding information?" },
          ].map(({ q, text }) => (
            <div key={q} className="flex items-center gap-4">
              <span className="font-semibold w-8">{q}.</span>
              <span className="flex-1">{text}</span>
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
    </div>
  );

  const renderSection3 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 21-25</h3>
        <p className="text-blue-800 text-sm">
          Choose the correct letter, A, B, or C.
        </p>
      </div>
      <div className="space-y-4">
        {[
          {
            q: 21,
            text: "The position needs someone good at",
            options: ["Computers.", "Dealing with people.", "Arts."],
          },
          {
            q: 22,
            text: "The directors will select someone from the faculty of",
            options: ["Arts.", "Computing.", "Business."],
          },
          {
            q: 23,
            text: "The position will require the person to",
            options: ["Work long hours.", "Train others.", "Do weekend work."],
          },
          {
            q: 24,
            text: "The position will come with a",
            options: ["Car.", "Parking space.", "Much better salary."],
          },
          {
            q: 25,
            text: "The best aspect of the job is it",
            options: [
              "Gives more responsibility.",
              "Comes with a private office.",
              "Is a step to higher positions.",
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
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 26-30</h3>
        <p className="text-blue-800 text-sm">
          Complete the table. Write NO MORE THAN TWO WORDS OR A NUMBER for each
          answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Candidates</th>
              <th className="text-center py-2">Steven</th>
              <th className="text-center py-2">Abdul</th>
              <th className="text-center py-2">Lek</th>
              <th className="text-center py-2">Oscar</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3 font-semibold">Years of Experience</td>
              <td className="py-3 text-center">
                <input
                  type="text"
                  value={answers[26] || ""}
                  onChange={(e) => handleAnswerChange(26, e.target.value)}
                  className="border rounded px-2 py-1 w-20 mx-auto"
                  placeholder="26"
                />
              </td>
              <td className="py-3 text-center">7</td>
              <td className="py-3 text-center">8</td>
              <td className="py-3 text-center">12</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 font-semibold">Qualification</td>
              <td className="py-3 text-center">MBA</td>
              <td className="py-3 text-center">
                <input
                  type="text"
                  value={answers[27] || ""}
                  onChange={(e) => handleAnswerChange(27, e.target.value)}
                  className="border rounded px-2 py-1 w-20 mx-auto"
                  placeholder="27"
                />
              </td>
              <td className="py-3 text-center">degree</td>
              <td className="py-3 text-center">Certificates</td>
            </tr>
            <tr>
              <td className="py-3 font-semibold">Possible Concerns</td>
              <td className="py-3 text-center">
                <input
                  type="text"
                  value={answers[28] || ""}
                  onChange={(e) => handleAnswerChange(28, e.target.value)}
                  className="border rounded px-2 py-1 w-24 mx-auto"
                  placeholder="28"
                />
              </td>
              <td className="py-3 text-center">limited English</td>
              <td className="py-3 text-center">
                <input
                  type="text"
                  value={answers[29] || ""}
                  onChange={(e) => handleAnswerChange(29, e.target.value)}
                  className="border rounded px-2 py-1 w-24 mx-auto"
                  placeholder="29"
                />
              </td>
              <td className="py-3 text-center">
                <input
                  type="text"
                  value={answers[30] || ""}
                  onChange={(e) => handleAnswerChange(30, e.target.value)}
                  className="border rounded px-2 py-1 w-24 mx-auto"
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
        <h3 className="font-semibold text-blue-900 mb-2">Questions 31-33</h3>
        <p className="text-blue-800 text-sm">
          Choose the correct letter, A, B, or C.
        </p>
      </div>
      <div className="space-y-4">
        {[
          {
            q: 31,
            text: "Caves are",
            options: [
              "Often ignored.",
              "Mostly in remote areas.",
              "Often difficult to explore.",
            ],
          },
          {
            q: 32,
            text: "People who explore caves",
            options: [
              "Mostly need to know about cartography.",
              "Enjoy overcoming the difficulties.",
              "Usually know about cave sciences.",
            ],
          },
          {
            q: 33,
            text: "China has",
            options: [
              "Probably the most undiscovered caves.",
              "A growing number of cave explorers.",
              "Some of the best documented caves.",
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
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 34-40</h3>
        <p className="text-blue-800 text-sm">
          Complete the table and notes. Write NO MORE THAN TWO WORDS OR A NUMBER
          for each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold text-lg mb-4">
          Three Main Reasons for Cave Formation
        </h4>
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-3 font-semibold">Dissolution</th>
              <th className="text-left py-3 px-3 font-semibold">
                Volcanic Lava Tubes
              </th>
              <th className="text-left py-3 px-3 font-semibold">
                Action of Waves
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-3 align-top">
                <p>
                  mainly involves{" "}
                  <input
                    type="text"
                    value={answers[34] || ""}
                    onChange={(e) => handleAnswerChange(34, e.target.value)}
                    className="border rounded px-2 py-1 w-32 mx-1"
                    placeholder="34"
                  />
                </p>
              </td>
              <td className="py-4 px-3 align-top">
                <p>
                  topmost surface cools down and{" "}
                  <input
                    type="text"
                    value={answers[35] || ""}
                    onChange={(e) => handleAnswerChange(35, e.target.value)}
                    className="border rounded px-2 py-1 w-32 mx-1"
                    placeholder="35"
                  />{" "}
                  hotter lava continue to flow beneath
                </p>
              </td>
              <td className="py-4 px-3 align-top">
                <p>
                  waves pound in to cliffs then erode into{" "}
                  <input
                    type="text"
                    value={answers[36] || ""}
                    onChange={(e) => handleAnswerChange(36, e.target.value)}
                    className="border rounded px-2 py-1 w-32 mx-1"
                    placeholder="36"
                  />{" "}
                  or less rigid rocks.
                </p>
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-3" rowSpan="2">
                <p className="font-semibold">Limestone caves</p>
              </td>
              <td className="py-4 px-3" colSpan="2">
                <p>
                  often have formations made of{" "}
                  <input
                    type="text"
                    value={answers[37] || ""}
                    onChange={(e) => handleAnswerChange(37, e.target.value)}
                    className="border rounded px-2 py-1 w-32 mx-1"
                    placeholder="37"
                  />{" "}
                  carbonate
                </p>
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-3" colSpan="2">
                <p>
                  e.g. stalactites, stalagmites, and{" "}
                  <input
                    type="text"
                    value={answers[38] || ""}
                    onChange={(e) => handleAnswerChange(38, e.target.value)}
                    className="border rounded px-2 py-1 w-32 mx-1"
                    placeholder="38"
                  />
                </p>
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-3" rowSpan="2">
                <p className="font-semibold">e.g.</p>
                <p className="font-semibold">Lechuguilla</p>
              </td>
              <td className="py-4 px-3" colSpan="2">
                <p>
                  finally revealed in{" "}
                  <input
                    type="text"
                    value={answers[39] || ""}
                    onChange={(e) => handleAnswerChange(39, e.target.value)}
                    className="border rounded px-2 py-1 w-32 mx-1"
                    placeholder="39"
                  />
                </p>
              </td>
            </tr>
            <tr>
              <td className="py-4 px-3" colSpan="2">
                <p>
                  interestingly, formed from the{" "}
                  <input
                    type="text"
                    value={answers[40] || ""}
                    onChange={(e) => handleAnswerChange(40, e.target.value)}
                    className="border rounded px-2 py-1 w-32 mx-1"
                    placeholder="40"
                  />
                </p>
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
            IELTS Listening Test 3 - Section {currentSection}
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

export default ListeningTest3;
