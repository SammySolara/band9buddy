// src/components/ielts/tests/SpeakingTest1.js
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
import { useAuth } from "../../../contexts/AuthContext";

const SpeakingTest1 = ({ onComplete, onExit }) => {
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
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const SPEAKING_TEST = {
    part1: {
      title: "Part 1: Introduction and Interview",
      duration: "4-5 minutes",
      instructions:
        "Answer questions about yourself and familiar topics. Click to see band 8-9 model answers.",
      questions: [
        {
          q: "Do you live in a house or an apartment?",
          models: [
            "I currently live in a modern apartment in the city center. It's a two-bedroom flat on the fifth floor of a recently built complex. I've been living there for about two years now, and I really appreciate the convenience of being close to public transportation and local amenities.",
            "I live in a traditional house in a suburban area. It's a three-story townhouse that my family has owned for several years. What I particularly enjoy about it is having a small garden where I can relax and grow some plants, which you don't typically get with apartment living.",
          ],
        },
        {
          q: "What do you like most about your home?",
          models: [
            "What I appreciate most is definitely the natural lighting. The apartment has large windows facing east, so we get beautiful morning sunlight that really brightens up the space. It creates a very warm and welcoming atmosphere, and I find it helps me feel more energized throughout the day.",
            "I'd say the thing I value most is the sense of community in our neighborhood. The house is located in a quiet residential area where people know each other, and there's a real sense of belonging. It's that friendly, village-like atmosphere that you rarely find in big cities nowadays.",
          ],
        },
        {
          q: "What do you like to do in your free time?",
          models: [
            "I'm quite passionate about photography, actually. I enjoy taking my camera out on weekends to capture urban landscapes and street scenes. It's not just about taking pictures; it's more about observing the world from different perspectives and finding beauty in everyday moments. It's become quite a therapeutic hobby for me.",
            "I'm really into cooking and experimenting with different cuisines. I find it incredibly relaxing to spend time in the kitchen trying out new recipes, especially dishes from various cultures. It's creative, practical, and I get to share the results with friends and family, which makes it even more rewarding.",
          ],
        },
      ],
    },
    part2: {
      title: "Part 2: Individual Long Turn",
      duration: "3-4 minutes (1 min prep + 2 min talk)",
      instructions:
        "Prepare for 1 minute, then speak for 2 minutes. Select a model answer to emulate.",
      topic:
        "Describe a person who has had an important influence on your life.",
      points: [
        "Who this person is",
        "How you know this person",
        "What this person has done to influence you",
        "And explain why this person has been important in your life",
      ],
      models: [
        "I'd like to talk about my high school English teacher, Mrs. Anderson, who had a profound impact on my academic journey and personal development. I first met her when I was 15, during what was quite a challenging period in my life.\n\nMrs. Anderson wasn't just an excellent educator; she was someone who genuinely cared about her students' wellbeing beyond their academic performance. She had this remarkable ability to recognize when students were struggling, not just with coursework but with personal issues as well. I remember she took extra time after classes to help me improve my writing skills, but more importantly, she encouraged me to express myself and build confidence.\n\nWhat really set her apart was her teaching philosophy. She always emphasized that mistakes were opportunities for growth rather than failures to be ashamed of. This perspective completely changed how I approached learning and challenges in general. She introduced me to literature that opened my mind to different perspectives and cultures, which sparked my lifelong love for reading.\n\nThe reason she's been so important in my life is that she taught me the value of perseverance and self-belief. During times when I doubted my abilities, her encouragement and faith in my potential kept me motivated. Even now, years later, I find myself applying the lessons she taught me, not just in academic settings but in my professional life and personal relationships.",
        "The person I want to describe is my grandmother, who has been an incredibly influential figure throughout my entire life. I've known her since birth, obviously, but it was during my teenage years that I really began to appreciate her wisdom and strength.\n\nMy grandmother grew up in difficult circumstances, facing significant economic hardships and limited educational opportunities. Despite these challenges, she managed to build a successful small business and provided for her entire family. What's remarkable is that she never became bitter about her struggles; instead, she maintained an optimistic outlook and generous spirit.\n\nHer influence on me has been multifaceted. Firstly, she taught me the importance of resilience and hard work through her own example rather than just words. Watching her handle difficulties with grace and determination showed me that obstacles are temporary and can be overcome with persistence. Secondly, she instilled in me strong values about family, community, and helping others.\n\nWhat makes her particularly important in my life is the emotional support and unconditional love she's provided. In a world that often feels judgmental and competitive, she's been a constant source of acceptance and encouragement. Her stories about overcoming adversity have given me perspective during my own challenging times, and her practical wisdom has guided many of my important life decisions.",
      ],
    },
    part3: {
      title: "Part 3: Two-way Discussion",
      duration: "4-5 minutes",
      instructions:
        "Discuss more abstract questions. These require deeper analysis.",
      questions: [
        {
          q: "What qualities make someone a good role model?",
          models: [
            "I think a good role model needs to demonstrate consistency between their words and actions, what we call integrity. They should practice what they preach rather than just telling others how to behave. Additionally, genuine role models show resilience when facing challenges, which teaches others that setbacks are normal and manageable. I also believe humility is crucial; the best role models acknowledge their mistakes and show that continuous learning and growth are lifelong processes.",
            "From my perspective, authenticity is perhaps the most important quality. People need role models who are genuine rather than putting on a persona for public consumption. Beyond that, I'd say emotional intelligence matters greatly, the ability to understand and manage one's emotions while being empathetic toward others. Good role models also demonstrate ethical decision-making, especially when facing difficult choices where doing the right thing might not be the easiest path.",
          ],
        },
        {
          q: "How has social media changed the concept of role models?",
          models: [
            "Social media has democratized influence in both positive and negative ways. On one hand, it's given voice to diverse individuals who might not have had platforms before, allowing people from various backgrounds to inspire others. However, it's also created a culture where influence is often based on popularity metrics rather than genuine merit or positive values. The constant exposure to curated, idealized versions of people's lives can set unrealistic standards.",
            "I think social media has fundamentally transformed who we consider as role models and why. Previously, role models were often established figures in specific fields like athletes, scientists, or community leaders. Now, young people might look up to content creators or influencers whose main achievement is their online following. This shift has pros and cons. It's made role models more accessible and relatable, but it's also sometimes prioritized entertainment value over substance.",
          ],
        },
      ],
    },
  };

  const startRecording = () => {
    if (recognitionRef.current && browserSupported) {
      setTranscript("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
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
        // Calculate average rating
        const allRatings = Object.values(selfRatings);
        const avgRating =
          allRatings.length > 0
            ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
            : 0;

        // Save to database
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
                test_number: 1,
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

export default SpeakingTest1;
