// src/components/ielts/tests/SpeakingTest3.js
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

const SpeakingTest3 = ({ onComplete, onExit }) => {
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
        "Answer questions about yourself and familiar topics. Click to see model answers.",
      questions: [
        {
          q: "Are you living in a house or a flat?",
          models: [
            "Currently I'm living in a rented flat on Phao Dai Lang Street. It's not so far from my workplace, only about 2 kilometers.",
            "I live in a small apartment in the city center. It's quite convenient for commuting to work and accessing various amenities. The flat has two bedrooms and a nice balcony where I can relax in the evenings.",
          ],
        },
        {
          q: "How long have you been living there?",
          models: [
            "Less than a year. Before I moved to this flat, I had been living with my parents but it's too far from my workplace and the traffic there was always terrible. It took me a long while to find this place but I'm pretty happy with it now.",
            "I've been living in my current apartment for about eight months now. I moved there shortly after starting my new job. The transition was quite smooth, and I've really settled into the neighborhood. I appreciate the convenience it offers compared to my previous accommodation.",
          ],
        },
        {
          q: "What do you want to change about your neighborhood?",
          models: [
            "Hmm… That's an interesting question. Actually I've never thought of this before. My neighborhood is pretty good I think. It's quite civilized, and the location is convenient for me to travel to work. I don't think I want to change any of these.",
            "If I could change one thing, it would be to have more green spaces and parks in the area. While my neighborhood is convenient and well-connected, it's quite urbanized with limited areas for outdoor recreation. Having more parks would provide residents with places to exercise and relax, which would significantly improve the quality of life in the community.",
          ],
        },
        {
          q: "Are there a lot of holidays in Vietnam?",
          models: [
            "Let me see…quite a lot. I mean, there're holidays almost every month, and sometimes these holidays are to celebrate the most ridiculous things. But I'm fine with that, you know, I have more days off from work!",
            "Yes, Vietnam has a fairly generous number of public holidays throughout the year. We have the traditional holidays like Tet, which is the Lunar New Year, as well as national holidays such as Independence Day and Victory Day. In total, we have around 10-12 public holidays annually, which gives people opportunities to rest and spend time with family.",
          ],
        },
        {
          q: "What do Vietnamese people like to do during holidays?",
          models: [
            "I think most Vietnamese people want to stay at home and relax to recover after hard days at work and school. I also notice that families in the city often go on a picnic during these days.",
            "Holiday activities vary quite a bit depending on the occasion. During major holidays like Tet, families typically gather for reunion dinners and visit relatives. For shorter holidays, many people choose to travel to nearby beaches or countryside destinations. Young people often meet up with friends for entertainment, while families might enjoy outings to parks or restaurants. It's also common for people to simply stay home and rest, especially after busy work periods.",
          ],
        },
      ],
    },
    part2: {
      title: "Part 2: Individual Long Turn",
      duration: "3-4 minutes (1 min prep + 2 min talk)",
      instructions:
        "Prepare for 1 minute, then speak for 2 minutes. Select a model answer to emulate.",
      topic: "Describe an important historical event",
      points: [
        "What event it is",
        "When it happened",
        "Who or what was involved in it",
        "And explain why you think it is an important historical event",
      ],
      models: [
        "I would like to tell you about one of the most important past events to me. That is the time when President Ho Chi Minh read the Declaration of Independence, establishing the Socialist Republic of Vietnam.\n\nHistory lessons at school in Vietnam might be boring, and not so many students pay attention to their teachers' words in history classes, but I'm sure there's one thing about history that all students in Vietnam remember. That is the date of the day marking our freedom. September 2nd 1945 was a glorious day. Thousands of people gathered at the Ba Dinh Square to listen to the Declaration of Independence.\n\nYou know, in the past, our country was invaded and colonized for a very long time by different nations, but we never forgot our traditions and customs, and always tried to fight the enemies to reclaim our independence. Our biggest enemy might be China, but the hardest one to fight was France. They colonized us for almost 100 years, feasted on our people's blood and sweat. Most Vietnamese people back then were farmers. They were uneducated and had to bow to their inhumane land lords. Despite the great disadvantages, they were still able to unite and keep fighting bravely. Millions of them died, but their heroic actions live forever. And as you can guess, we finally took back our freedom.\n\nFrom that day up until now, every Vietnamese person has the right to proudly say that he or she is free. I mean, I'm truly grateful to all the soldiers who overcame great hardships and fought with their lives so that I can enjoy a better life now.",
        "I'd like to discuss the fall of the Berlin Wall in 1989, which I consider one of the most significant events in modern history.\n\nThis historic event occurred on November 9th, 1989, when the Berlin Wall, which had divided East and West Berlin for 28 years, was finally opened. The wall had been erected in 1961 to prevent East Germans from fleeing to the West, and it became a powerful symbol of the Cold War division between communist and democratic nations.\n\nThe event involved millions of people—from the ordinary citizens of Berlin who climbed onto the wall in celebration, to the border guards who decided not to use force, to political leaders on both sides who had to navigate this unprecedented situation. The opening of the wall was largely driven by peaceful protests and political pressure from East German citizens demanding freedom of movement and democratic reforms.\n\nThis event is historically important for several reasons. First, it marked the beginning of the end of the Cold War and led to the reunification of Germany within a year. Second, it triggered a domino effect that resulted in the collapse of communist regimes throughout Eastern Europe. Finally, it demonstrated the power of peaceful protest and the universal human desire for freedom. The images of people celebrating on top of the wall and families reuniting after decades of separation remain powerful symbols of hope and unity. This event fundamentally reshaped the political landscape of Europe and influenced global politics for decades to come.",
      ],
    },
    part3: {
      title: "Part 3: Two-way Discussion",
      duration: "4-5 minutes",
      instructions:
        "Discuss more abstract questions. These require deeper analysis.",
      questions: [
        {
          q: "How is history taught in Vietnam?",
          models: [
            "It's just terrible. I mean, most students are given a history book full of text and unnecessary details of some wars, written in a way that attract little interest. During all my years at school, my history teachers' job was to read the whole text out loud and make sure that their students write everything down in their notebook. It's really boring and tiresome!",
            "History education in Vietnam primarily relies on textbooks and traditional teaching methods. Students are required to learn chronological sequences of historical events, particularly those related to Vietnam's struggle for independence and unification. The curriculum emphasizes memorization of dates, names, and events. While this approach ensures students have a solid foundation of historical knowledge, it can sometimes make the subject feel less engaging. Teachers typically lecture from textbooks, and students are expected to take notes and recall information for exams. However, I've noticed that some progressive schools are beginning to incorporate more interactive methods, such as historical reenactments and field trips to historical sites, which make the learning experience more dynamic and memorable.",
          ],
        },
        {
          q: "Is there any difference between teaching history through books and movies?",
          models: [
            "I feel lucky you mentioned that. I've always dreamed of one day when history in my country are taught via movies and video documentaries. That way students might feel more excited and finally be able to pay attention to the knowledge they are learning in class. By presenting history in the form of images and videos, I believe history classes can achieve their original purpose – to teach history instead of lulling students to sleep.",
            "Absolutely, there's a significant difference. Books provide detailed, accurate information and allow for deep analysis of historical events, but they can be dry and difficult to engage with, especially for younger students. Movies and documentaries, on the other hand, bring history to life through visual storytelling, making events more relatable and emotionally resonant. They can show the human side of historical figures and help students understand the context and atmosphere of different time periods. However, it's important to note that films may sometimes sacrifice historical accuracy for entertainment value. The ideal approach would be to use both methods complementarily—using books for accurate, detailed information and films to spark interest and provide visual context. This combination would cater to different learning styles and make history education more comprehensive and engaging.",
          ],
        },
        {
          q: "Why are there many children who do not like to learn history?",
          models: [
            "There are two reasons in my opinion. The first reason is that most of them are not mature enough to feel interested in battles and wars that happened in the past. I mean, they are too young and are more keen on animated movies and video games. The second reason is the way that history is taught in most countries nowadays. I hold a strong belief that if schools change the way they teach history, things will be a lot different.",
            "I think there are several interconnected reasons for children's disinterest in history. First and foremost, the teaching methodology often fails to make historical events relevant to students' lives. When history is presented as a series of disconnected dates and facts to memorize, rather than as stories about real people facing real challenges, it becomes difficult for young minds to engage with the material. Additionally, many children struggle to see the connection between past events and their present lives—they don't understand why events from centuries ago should matter to them today. The lack of interactive and multimedia elements in traditional history education is another factor. In an age where children are accustomed to engaging with technology and interactive media, sitting and listening to lectures can feel particularly tedious. Furthermore, history curricula often focus heavily on political and military events while neglecting social, cultural, and technological developments that might be more relatable to young students. If educators could make history more interactive, show its relevance to contemporary issues, and present it in more diverse and engaging ways, I believe we would see a significant shift in students' attitudes toward the subject.",
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
                test_number: 3,
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
            {showModelAnswer ? "Hide" : "Show"} Model Answers
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

export default SpeakingTest3;
