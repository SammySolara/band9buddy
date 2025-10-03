// src/components/ielts/tests/SpeakingTest2.js
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Mic,
  MicOff,
  ChevronRight,
  Volume2,
  AlertCircle,
  Star,
} from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";

const SpeakingTest2 = ({ onComplete, onExit }) => {
  const { user, session } = useAuth();

  const [currentPart, setCurrentPart] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [accuracy, setAccuracy] = useState(0);
  const [selfRatings, setSelfRatings] = useState({});
  const [completedParts, setCompletedParts] = useState({});
  const [showResults, setShowResults] = useState(false);

  const recognitionRef = useRef(null);
  const [browserSupported, setBrowserSupported] = useState(true);
  const lastSpeechTimeRef = useRef(Date.now());
  const pauseTimeoutRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setBrowserSupported(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const now = Date.now();
        const timeSinceLastSpeech = now - lastSpeechTimeRef.current;

        let finalTranscript = "";
        let hasInterim = false;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            let text = event.results[i][0].transcript.trim();

            if (timeSinceLastSpeech > 100 && text) {
              setTranscript((prev) => {
                if (prev && !/[.!?,;:]\s*$/.test(prev.trim())) {
                  return (
                    prev.trim() +
                    ". " +
                    text.charAt(0).toUpperCase() +
                    text.slice(1) +
                    " "
                  );
                }
                return (
                  prev + (text.charAt(0).toUpperCase() + text.slice(1)) + " "
                );
              });
              lastSpeechTimeRef.current = now;
              return;
            }

            if (text) {
              text = text.charAt(0).toUpperCase() + text.slice(1);
            }

            finalTranscript += text + " ";
          } else {
            hasInterim = true;
          }
        }

        if (finalTranscript) {
          setTranscript((prev) => {
            const combined = prev + finalTranscript;
            return combined.replace(
              /([.!?])\s+([a-z])/g,
              (match, punct, letter) => {
                return punct + " " + letter.toUpperCase();
              }
            );
          });
        }

        if (hasInterim || finalTranscript) {
          lastSpeechTimeRef.current = now;
        }

        if (pauseTimeoutRef.current) {
          clearTimeout(pauseTimeoutRef.current);
        }

        pauseTimeoutRef.current = setTimeout(() => {
          setTranscript((prev) => {
            if (prev && !/[.!?,;:]\s*$/.test(prev.trim())) {
              return prev.trim() + ". ";
            }
            return prev;
          });
        }, 1500);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  const SPEAKING_TEST = {
    part1: {
      title: "Part 1: Introduction and Interview",
      duration: "4-5 minutes",
      instructions:
        "Answer questions about yourself and familiar topics. Click to see band 8-9 model answers.",
      questions: [
        {
          q: "Are you a student or do you work?",
          models: [
            "I'm a student at Foreign Trade University, which is located on Chua Lang street. My school is about 5 kilometers away from where I live.",
            "I'm currently working as a software developer at a tech company in the city center. I've been in this position for about two years now, and I find the work quite challenging but rewarding.",
          ],
        },
        {
          q: "Do you enjoy what you study?",
          models: [
            "Not really. I don't think what I am learning is practical and there is always a lot of homework and deadlines. But my friends at school are really nice. They are the main reason for me to go to class.",
            "Yes, I do enjoy my studies quite a bit. I'm majoring in computer science, and I find the subject matter fascinating. What I particularly appreciate is how the theoretical concepts we learn can be applied to solve real-world problems. The coursework can be demanding at times, but the satisfaction of understanding complex concepts makes it worthwhile.",
          ],
        },
        {
          q: "Are street markets common in Vietnam?",
          models: [
            "Yes. Street markets and supermarkets coexist in Vietnam because people prefer to have more than one option for grocery shopping. Street markets offer a variety of products from food to clothing. Most of the goods here are dirt-cheap.",
            "Absolutely, street markets are very common throughout Vietnam. They're an integral part of Vietnamese culture and daily life. You'll find them in almost every neighborhood, and they're particularly bustling in the early morning hours. What makes them special is the fresh produce and the authentic local atmosphere.",
          ],
        },
        {
          q: "What is usually sold there?",
          models: [
            "As I mentioned before, mostly groceries. However, there is another kind of street market, the night market, which is a must-visit place for tourists. These open-air markets are a heaven for shopaholics with lots of accessory shops.",
            "The variety is quite impressive, actually. You can find fresh fruits and vegetables, meat, seafood, and various prepared foods. Beyond groceries, there are also vendors selling household items, clothing, and accessories. The night markets, in particular, are famous for handicrafts, souvenirs, and street food, making them popular with both locals and tourists.",
          ],
        },
      ],
    },
    part2: {
      title: "Part 2: Individual Long Turn",
      duration: "3-4 minutes (1 min prep + 2 min talk)",
      instructions:
        "Prepare for 1 minute, then speak for 2 minutes. Select a model answer to emulate.",
      topic: "Describe a time someone gave you money as a gift.",
      points: [
        "When you received money",
        "Who the person was",
        "Why he/she gave you money",
        "And how did you feel about the gift",
      ],
      models: [
        "Let me tell you about the time my parents gave me some money as a present.\n\nSo you know during Tet holiday, adults often give children red envelopes with paper money inside. Traditionally, these notes are a blessing for a new year of good health, luck and happiness. However, this custom has become something ugly as many children do not understand such gestures and think of these gifts as nothing more than some extra pocket money. I was no exception.\n\nFor years, my parents have always been the most generous people when it comes to the amount of money I received in these red envelopes. Sometimes they gave me a million VND, which was like a fortune to a kid at the time. However, about five to six years ago, when I received a two dollar note, which was about 40 thousand VND, from my parent's envelope, I was super disappointed. No further explanations were given for the loss of the lion's share of my income during Tet that year.\n\nOnce I had to start giving out money, I began to understand what my parents were trying to teach me. Kids need to realize that lucky money is only meant for good luck. I hated to see that the first thing many kids do after receiving my envelopes is to immediately check how much they earn. My future kids, therefore, should not expect a thick envelope from me during Tet.",
        "I'd like to talk about a meaningful monetary gift I received from my grandmother on my 18th birthday.\n\nThis happened about three years ago when I was transitioning from high school to university. My grandmother, who had always been supportive of my education, surprised me with an envelope containing a substantial amount of money. What made it particularly special was that she had been saving this money specifically for this occasion over several years.\n\nThe reason she gave me this gift was to help with my university expenses. She knew that my parents were already stretched financially, and she wanted to ensure I could focus on my studies without too much financial stress. She told me that education was the best investment anyone could make, and this was her way of investing in my future.\n\nHonestly, I felt quite emotional about it. It wasn't just about the money itself, but rather what it represented. It showed how much she believed in me and my potential. I was touched by her thoughtfulness and the sacrifice she must have made to save that amount. This gift taught me the value of generosity and planning for the future. I've kept a portion of that money in a savings account as a reminder of her kindness, and I've promised myself that one day I'll pay it forward by helping someone else achieve their educational goals.",
      ],
    },
    part3: {
      title: "Part 3: Two-way Discussion",
      duration: "4-5 minutes",
      instructions:
        "Discuss more abstract questions. These require deeper analysis.",
      questions: [
        {
          q: "Do you think money management skills are important?",
          models: [
            "Absolutely. Knowing how to manage money properly is an essential life skill, you know. It helps us avoid getting into financial issues in the future. For example, many people cannot stop themselves from purchasing unnecessary items. A person who has great money management skills, on the other hand, will save up some money in case of emergencies.",
            "I believe money management skills are crucial for several reasons. First, they provide financial security and reduce stress about unexpected expenses. Second, good money management enables people to achieve their long-term goals, whether that's buying a home, starting a business, or retiring comfortably. Perhaps most importantly, these skills help people distinguish between needs and wants, which is increasingly difficult in our consumer-driven society. Without proper money management, even high earners can find themselves in financial difficulty.",
          ],
        },
        {
          q: "Do you think cash will be replaced by credit cards in the future?",
          models: [
            "I believe payment by cash will be a thing of the past. Most developed nations have managed to establish cashless societies where credit cards or mobile payment are more commonly used than cash. Cashless payment needs a boost in Vietnam since most Vietnamese people are still used to carrying a lot of money at all times.",
            "I think we're definitely moving toward a cashless society, though the transition will vary by country and demographic. In many developed nations, digital payments have already become the norm, and the COVID-19 pandemic accelerated this trend significantly. However, I don't think cash will disappear entirely, at least not in the near future. There will always be situations where cash is necessary, such as in rural areas with limited internet connectivity, or for people who prefer the tangibility and budgeting control that cash provides. The real question is whether we can ensure that digital payment systems are accessible and secure for everyone.",
          ],
        },
      ],
    },
  };

  const startRecording = () => {
    if (recognitionRef.current && browserSupported) {
      setTranscript("");
      lastSpeechTimeRef.current = Date.now();
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);

      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }

      setTranscript((prev) => {
        if (prev && !/[.!?,;:]\s*$/.test(prev.trim())) {
          return prev.trim() + ".";
        }
        return prev;
      });

      if (selectedModel && transcript) {
        calculateAccuracy();
      }
    }
  };

  const calculateAccuracy = () => {
    if (!selectedModel || !transcript) return;

    const modelWords = selectedModel.toLowerCase().split(/\s+/);
    const transcriptWords = transcript.toLowerCase().split(/\s+/);

    let matchCount = 0;
    transcriptWords.forEach((word) => {
      if (modelWords.includes(word)) matchCount++;
    });

    const accuracyPercent = Math.round((matchCount / modelWords.length) * 100);
    setAccuracy(accuracyPercent);
  };

  const handleSelfRating = (category, rating) => {
    setSelfRatings((prev) => ({
      ...prev,
      [`part${currentPart}_q${currentQuestion}_${category}`]: rating,
    }));
  };

  const getCurrentContent = () => {
    const part = SPEAKING_TEST[`part${currentPart}`];
    if (currentPart === 2) {
      return part;
    }
    return part.questions[currentQuestion];
  };

  const moveToNextQuestion = async () => {
    const part = SPEAKING_TEST[`part${currentPart}`];
    if (currentPart === 2 || currentQuestion >= part.questions.length - 1) {
      setCompletedParts((prev) => ({ ...prev, [currentPart]: true }));
      if (currentPart < 3) {
        setCurrentPart(currentPart + 1);
        setCurrentQuestion(0);
      } else {
        const allRatings = Object.values(selfRatings);
        const avgRating =
          allRatings.length > 0
            ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
            : 0;

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
                test_type: "speaking",
                test_number: 2,
                completed_at: new Date().toISOString(),
                status: "completed",
                speaking_data: selfRatings,
                average_self_rating: avgRating,
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

        setShowResults(true);
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
    setTranscript("");
    setSelectedModel(null);
    setShowModelAnswer(false);
    setAccuracy(0);
  };

  const renderRatingStars = (category) => {
    const rating =
      selfRatings[`part${currentPart}_q${currentQuestion}_${category}`] || 0;
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-32">{category}:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleSelfRating(category, star)}
              className={`${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-400`}
            >
              <Star className="h-5 w-5 fill-current" />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const allRatings = Object.values(selfRatings);
    const avgRating =
      allRatings.length > 0
        ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1)
        : 0;

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-4">
          Practice Complete!
        </h2>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Average Self-Rating</p>
            <p className="text-4xl font-bold text-orange-600">
              {avgRating} / 5.0
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Next Steps</h3>
          <p className="text-blue-800 text-sm">
            Consider recording yourself and using ChatGPT or a speaking partner
            for more detailed feedback on pronunciation, fluency, and coherence.
          </p>
        </div>

        <button
          onClick={onExit}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold"
        >
          <ArrowLeft className="h-5 w-5" /> Back to Tests
        </button>
      </div>
    );
  };

  const renderTest = () => {
    const content = getCurrentContent();
    const part = SPEAKING_TEST[`part${currentPart}`];

    if (!browserSupported) {
      return (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">
                  Browser Not Supported
                </h3>
                <p className="text-red-800 text-sm mb-3">
                  Your browser doesn't support the Web Speech API. Please use
                  Chrome, Edge, or Safari for the speaking test.
                </p>
                <button
                  onClick={onExit}
                  className="text-red-700 underline text-sm"
                >
                  Go back
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{part.title}</h2>
            <p className="text-gray-600 text-sm">{part.duration}</p>
          </div>
          <div className="text-sm text-gray-600">Part {currentPart} of 3</div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-800 text-sm">{part.instructions}</p>
        </div>

        {currentPart === 2 ? (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">{content.topic}</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="font-medium mb-2">You should talk about:</p>
              <ul className="list-disc list-inside space-y-1">
                {content.points.map((point, idx) => (
                  <li key={idx} className="text-gray-700">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-4">
              Question {currentQuestion + 1}: {content.q}
            </h3>
          </div>
        )}

        <div className="mb-6">
          <button
            onClick={() => setShowModelAnswer(!showModelAnswer)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <Volume2 className="h-4 w-4" />
            {showModelAnswer ? "Hide" : "Show"} Model Answers (Band 8-9)
          </button>

          {showModelAnswer && (
            <div className="space-y-3">
              {content.models.map((model, idx) => (
                <div
                  key={idx}
                  className={`p-4 border-2 rounded-lg cursor-pointer ${
                    selectedModel === model
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedModel(model)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">
                      Model Answer {idx + 1}
                    </span>
                    {selectedModel === model && (
                      <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm whitespace-pre-line">
                    {model}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="flex justify-center mb-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-4 rounded-full ${
                isRecording
                  ? "bg-red-600 hover:bg-red-700 animate-pulse"
                  : "bg-orange-600 hover:bg-orange-700"
              } text-white transition-colors`}
            >
              {isRecording ? (
                <MicOff className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </button>
          </div>
          <p className="text-center text-sm text-gray-600 mb-4">
            {isRecording
              ? "Recording... Click to stop"
              : "Click to start recording your answer"}
          </p>

          {transcript && (
            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold mb-2">Your Response:</h4>
              <p className="text-gray-700 text-sm">{transcript}</p>
              {selectedModel && accuracy > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-600">
                    Word match accuracy:{" "}
                    <span className="font-bold text-orange-600">
                      {accuracy}%
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    This shows how many words from the model answer appeared in
                    your response
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-3">
            Self-Assessment (Rate yourself 1-5 stars):
          </h4>
          <div className="space-y-2">
            {renderRatingStars("Fluency")}
            {renderRatingStars("Vocabulary")}
            {renderRatingStars("Grammar")}
            {renderRatingStars("Pronunciation")}
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <button
            onClick={onExit}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" /> Exit
          </button>
          <button
            onClick={moveToNextQuestion}
            className="flex items-center gap-2 px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold"
          >
            {currentPart === 3 &&
            currentQuestion >= SPEAKING_TEST.part3.questions.length - 1
              ? "Finish Practice"
              : "Next"}
            <ChevronRight className="h-4 w-4" />
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

export default SpeakingTest2;
