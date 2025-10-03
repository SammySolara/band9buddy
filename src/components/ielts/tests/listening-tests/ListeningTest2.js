// src/components/ielts/ListeningTest2.js
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
import section1audio from "../../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-02-Section1.mp3";
import section2audio from "../../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-02-Section2.mp3";
import section3audio from "../../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-02-Section3.mp3";
import section4audio from "../../../../assets/IELTS-Recent-Actual-Test-With-Answers-Practice-Test-02-Section4.mp3";

const TOTAL_TIME = 2400; // 40 minutes in seconds

const ListeningTest2 = ({ onComplete, onExit }) => {
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

  // TODO: Fill in the answer key based on the correct answers
  const answerKey = {
    1: "Practical", // Peter and Mary's diet will be both sensible and...
    2: "Pizzas", // Every two months, they can eat...
    3: "Light Walking", // On Saturdays, they will go...
    4: "Pine Park", // This coming Saturday, they will go to...
    5: "Fruit Juice", // In every meal, there will be...
    6: "B", // Mary's opinion - Tuesdays
    7: "I", // Peter's opinion - Thursdays
    8: "C", // Mary's opinion - Thursdays
    9: "C", // Peter's opinion - Sundays
    10: "I", // Mary's opinion - Sundays
    11: "Padded", // Walls are...
    12: "Corners", // includes the...
    13: "Special Skill", // Teachers are able to teach a...
    14: "Learning Toys", // There are many special...
    15: "Disinfect", // They ... surfaces daily
    16: "Germs", // procedures to limit the spread of...
    17: "C", // has her own children?
    18: "A", // often sleeps at the center?
    19: "C", // is good with shy children?
    20: "B", // is a good cook?
    21: "Topic", // Decide on ... you like
    22: "Current", // Focus on ... area of interest
    23: "Thesis", // Write ... statement
    24: "Outline", // Create ...
    25: "Progress", // Ensure this ... clearly
    26: "Aspects", // There are several ... involved
    27: "Real-life", // give ... examples
    28: "Necessity", // which is a ...
    29: "Style Guide", // must follow the ... issued by the university
    30: "10%", // although it can vary by...
    31: "C", // Geocentrism
    32: "B", // Heliocentrism
    33: "C", // The night sky
    34: "Revolution", // started the Copernican...
    35: "Sick", // his book published the year he was...
    36: "Attention", // This book generated little...
    37: "Bruno", // ... was killed
    38: "Motion", // even the sun believed to be in...
    39: "Bible", // based on the...
    40: "20%", // ... of Americans believe in this
  };

  const audioFiles = {
    // TODO: Replace with your actual audio imports
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
            test_number: 2,
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
          Complete the sentences. Write NO MORE THAN TWO WORDS for each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded">
            <strong>Example:</strong> Peter consumes far too much{" "}
            <span className="underline">soft drink</span>
          </div>
          <div className="flex items-start gap-2">
            <strong>1.</strong>
            <div className="flex-1">
              <p className="mb-2">
                Peter and Mary's diet will be both sensible and
              </p>
              <input
                type="text"
                value={answers[1] || ""}
                onChange={(e) => handleAnswerChange(1, e.target.value)}
                className="border rounded px-2 py-1 w-full"
                placeholder="Answer 1"
              />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <strong>2.</strong>
            <div className="flex-1">
              <p className="mb-2">Every two months, they can eat</p>
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
            <strong>3.</strong>
            <div className="flex-1">
              <p className="mb-2">On Saturdays, they will go</p>
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
            <strong>4.</strong>
            <div className="flex-1">
              <p className="mb-2">This coming Saturday, they will go to</p>
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
            <strong>5.</strong>
            <div className="flex-1">
              <p className="mb-2">In every meal, there will be</p>
              <input
                type="text"
                value={answers[5] || ""}
                onChange={(e) => handleAnswerChange(5, e.target.value)}
                className="border rounded px-2 py-1 w-full"
                placeholder="Answer 5"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 6-10</h3>
        <p className="text-blue-800 text-sm">
          Choose the correct letter, C, I, or B.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <div className="mb-4 text-sm space-y-1">
          <p>
            <strong>C</strong> Chocolate
          </p>
          <p>
            <strong>I</strong> Ice cream
          </p>
          <p>
            <strong>B</strong> Biscuits
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2"></th>
              <th className="text-left py-2">Peter's opinion</th>
              <th className="text-left py-2">Mary's opinion</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 font-semibold">Tuesdays</td>
              <td className="py-2">B</td>
              <td className="py-2">
                <input
                  type="text"
                  value={answers[6] || ""}
                  onChange={(e) => handleAnswerChange(6, e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                  placeholder="6"
                  maxLength={1}
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-semibold">Thursdays</td>
              <td className="py-2">
                <input
                  type="text"
                  value={answers[7] || ""}
                  onChange={(e) => handleAnswerChange(7, e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                  placeholder="7"
                  maxLength={1}
                />
              </td>
              <td className="py-2">
                <input
                  type="text"
                  value={answers[8] || ""}
                  onChange={(e) => handleAnswerChange(8, e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                  placeholder="8"
                  maxLength={1}
                />
              </td>
            </tr>
            <tr>
              <td className="py-2 font-semibold">Sundays</td>
              <td className="py-2">
                <input
                  type="text"
                  value={answers[9] || ""}
                  onChange={(e) => handleAnswerChange(9, e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                  placeholder="9"
                  maxLength={1}
                />
              </td>
              <td className="py-2">
                <input
                  type="text"
                  value={answers[10] || ""}
                  onChange={(e) => handleAnswerChange(10, e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                  placeholder="10"
                  maxLength={1}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSection2 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 11-16</h3>
        <p className="text-blue-800 text-sm">
          Complete the table. Write NO MORE THAN TWO WORDS for each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold text-lg mb-4">
          Advantages of Stanfield Childcare Centre
        </h4>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 w-12"></th>
              <th className="text-left py-2">Detail</th>
              <th className="text-left py-2">Another Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3 font-semibold">1</td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <span>Walls are</span>
                  <input
                    type="text"
                    value={answers[11] || ""}
                    onChange={(e) => handleAnswerChange(11, e.target.value)}
                    className="border rounded px-2 py-1 w-40"
                    placeholder="11"
                  />
                </div>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <span>includes the</span>
                  <input
                    type="text"
                    value={answers[12] || ""}
                    onChange={(e) => handleAnswerChange(12, e.target.value)}
                    className="border rounded px-2 py-1 w-40"
                    placeholder="12"
                  />
                </div>
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-3 font-semibold">2</td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <span>Teachers are able to teach a</span>
                  <input
                    type="text"
                    value={answers[13] || ""}
                    onChange={(e) => handleAnswerChange(13, e.target.value)}
                    className="border rounded px-2 py-1 w-40"
                    placeholder="13"
                  />
                </div>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <span>There are many special</span>
                  <input
                    type="text"
                    value={answers[14] || ""}
                    onChange={(e) => handleAnswerChange(14, e.target.value)}
                    className="border rounded px-2 py-1 w-40"
                    placeholder="14"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-3 font-semibold">3</td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <span>They</span>
                  <input
                    type="text"
                    value={answers[15] || ""}
                    onChange={(e) => handleAnswerChange(15, e.target.value)}
                    className="border rounded px-2 py-1 w-40"
                    placeholder="15"
                  />
                  <span>surfaces daily</span>
                </div>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <span>procedures to limit the spread of</span>
                  <input
                    type="text"
                    value={answers[16] || ""}
                    onChange={(e) => handleAnswerChange(16, e.target.value)}
                    className="border rounded px-2 py-1 w-40"
                    placeholder="16"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 17-20</h3>
        <p className="text-blue-800 text-sm">
          Choose the correct letter, A, B, or C.
        </p>
        <p className="text-blue-800 text-sm mt-1">
          <strong>NB</strong> You may use a letter more than once.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <div className="mb-4 text-sm space-y-1">
          <p>
            <strong>A</strong> Andrea
          </p>
          <p>
            <strong>B</strong> Bella
          </p>
          <p>
            <strong>C</strong> Cathy
          </p>
        </div>
        <p className="font-semibold mb-3">Which childcare worker:</p>
        <div className="space-y-3">
          {[
            { q: 17, text: "has her own children?" },
            { q: 18, text: "often sleeps at the center?" },
            { q: 19, text: "is good with shy children?" },
            { q: 20, text: "is a good cook?" },
          ].map(({ q, text }) => (
            <div key={q} className="flex items-center gap-4">
              <span className="font-semibold w-8">{q}.</span>
              <span className="flex-1">{text}</span>
              <input
                type="text"
                value={answers[q] || ""}
                onChange={(e) => handleAnswerChange(q, e.target.value)}
                className="border rounded px-2 py-1 w-20"
                placeholder="A-C"
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
          Complete the flowchart. Write ONE WORD ONLY for each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold text-lg mb-4 text-center">
          Foundation for Essay Writing
        </h4>
        <div className="max-w-md mx-auto space-y-4">
          <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center gap-2">
              <span>Decide on</span>
              <input
                type="text"
                value={answers[21] || ""}
                onChange={(e) => handleAnswerChange(21, e.target.value)}
                className="border rounded px-2 py-1 w-32"
                placeholder="21"
              />
              <span>you like</span>
            </div>
          </div>
          <div className="text-center text-2xl">↓</div>
          <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center gap-2">
              <span>Focus on</span>
              <input
                type="text"
                value={answers[22] || ""}
                onChange={(e) => handleAnswerChange(22, e.target.value)}
                className="border rounded px-2 py-1 w-32"
                placeholder="22"
              />
              <span>area of interest</span>
            </div>
          </div>
          <div className="text-center text-2xl">↓</div>
          <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center gap-2">
              <span>Write</span>
              <input
                type="text"
                value={answers[23] || ""}
                onChange={(e) => handleAnswerChange(23, e.target.value)}
                className="border rounded px-2 py-1 w-32"
                placeholder="23"
              />
              <span>statement</span>
            </div>
          </div>
          <div className="text-center text-2xl">↓</div>
          <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center gap-2">
              <span>Create</span>
              <input
                type="text"
                value={answers[24] || ""}
                onChange={(e) => handleAnswerChange(24, e.target.value)}
                className="border rounded px-2 py-1 w-32"
                placeholder="24"
              />
            </div>
          </div>
          <div className="text-center text-2xl">↓</div>
          <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center gap-2">
              <span>Ensure this</span>
              <input
                type="text"
                value={answers[25] || ""}
                onChange={(e) => handleAnswerChange(25, e.target.value)}
                className="border rounded px-2 py-1 w-32"
                placeholder="25"
              />
              <span>clearly</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 26-30</h3>
        <p className="text-blue-800 text-sm">
          Complete the summary. Write NO MORE THAN TWO WORDS OR A NUMBER for
          each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <div className="space-y-3 leading-relaxed">
          <p>
            There are several{" "}
            <input
              type="text"
              value={answers[26] || ""}
              onChange={(e) => handleAnswerChange(26, e.target.value)}
              className="border rounded px-2 py-1 w-40 mx-1"
              placeholder="26"
            />{" "}
            involved in producing a good essay. The writer must think
            independently and give{" "}
            <input
              type="text"
              value={answers[27] || ""}
              onChange={(e) => handleAnswerChange(27, e.target.value)}
              className="border rounded px-2 py-1 w-40 mx-1"
              placeholder="27"
            />{" "}
            examples as support, each one with a reference (which is a{" "}
            <input
              type="text"
              value={answers[28] || ""}
              onChange={(e) => handleAnswerChange(28, e.target.value)}
              className="border rounded px-2 py-1 w-40 mx-1"
              placeholder="28"
            />
            ). The formatting must follow the{" "}
            <input
              type="text"
              value={answers[29] || ""}
              onChange={(e) => handleAnswerChange(29, e.target.value)}
              className="border rounded px-2 py-1 w-40 mx-1"
              placeholder="29"
            />{" "}
            issued by the university, as well as the word count decided by the
            lecturer, although it can vary by{" "}
            <input
              type="text"
              value={answers[30] || ""}
              onChange={(e) => handleAnswerChange(30, e.target.value)}
              className="border rounded px-2 py-1 w-40 mx-1"
              placeholder="30"
            />
            .
          </p>
        </div>
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
            text: "Geocentrism",
            options: [
              "has a long history.",
              "is similar to heliocentrism.",
              "took some time to be deduced.",
            ],
          },
          {
            q: 32,
            text: "Heliocentrism",
            options: [
              "was realised only recently.",
              "was not generally accepted.",
              "fitted the views of the church.",
            ],
          },
          {
            q: 33,
            text: "The night sky",
            options: [
              "is relatively simple.",
              "remains basically the same.",
              "was once used for navigation.",
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
          Complete the notes. Write ONE WORD OR A NUMBER for each answer.
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold text-lg mb-4">Nicolaus Copernicus</h4>
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <span>started the Copernican</span>
            <input
              type="text"
              value={answers[34] || ""}
              onChange={(e) => handleAnswerChange(34, e.target.value)}
              className="border rounded px-2 py-1 w-40"
              placeholder="34"
            />
          </div>
          <div className="flex items-center gap-2">
            <span>his book published the year he was</span>
            <input
              type="text"
              value={answers[35] || ""}
              onChange={(e) => handleAnswerChange(35, e.target.value)}
              className="border rounded px-2 py-1 w-40"
              placeholder="35"
            />
            <span>and then passed away</span>
          </div>
          <div className="flex items-center gap-2">
            <span>This book generated little</span>
            <input
              type="text"
              value={answers[36] || ""}
              onChange={(e) => handleAnswerChange(36, e.target.value)}
              className="border rounded px-2 py-1 w-40"
              placeholder="36"
            />
          </div>
        </div>
        <h4 className="font-bold text-lg mb-4">Other scientists</h4>
        <div className="space-y-3 mb-6">
          <p>Galileo was persecuted.</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={answers[37] || ""}
              onChange={(e) => handleAnswerChange(37, e.target.value)}
              className="border rounded px-2 py-1 w-40"
              placeholder="37"
            />
            <span>was killed.</span>
          </div>
          <div className="flex items-center gap-2">
            <span>even the sun believed to be in</span>
            <input
              type="text"
              value={answers[38] || ""}
              onChange={(e) => handleAnswerChange(38, e.target.value)}
              className="border rounded px-2 py-1 w-40"
              placeholder="38"
            />
          </div>
        </div>
        <h4 className="font-bold text-lg mb-4">Modern geocentrism</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span>based on the</span>
            <input
              type="text"
              value={answers[39] || ""}
              onChange={(e) => handleAnswerChange(39, e.target.value)}
              className="border rounded px-2 py-1 w-40"
              placeholder="39"
            />
          </div>
          <p>Believers also support creationism.</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={answers[40] || ""}
              onChange={(e) => handleAnswerChange(40, e.target.value)}
              className="border rounded px-2 py-1 w-40"
              placeholder="40"
            />
            <span>of Americans believe in this.</span>
          </div>
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
            IELTS Listening Test 2 - Section {currentSection}
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

export default ListeningTest2;
