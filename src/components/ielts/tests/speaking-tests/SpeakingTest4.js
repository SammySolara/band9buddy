// src/components/ielts/tests/SpeakingTest4.js
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

const SpeakingTest4 = ({ onComplete, onExit }) => {
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
          q: "Where are you from?",
          models: [
            "Well, I come from Hanoi, the capital of my country Vietnam. It's a small yet very beautiful city with a population of more than 7 million people.",
            "I'm from Ho Chi Minh City, which is the largest city in Vietnam. It's a bustling metropolis with a rich history and vibrant culture. The city has a population of over 9 million people and serves as the economic hub of the country. What I particularly appreciate about my hometown is its dynamic energy and the way it seamlessly blends traditional Vietnamese culture with modern development.",
          ],
        },
        {
          q: "What do you like about your city?",
          models: [
            "There're many awesome things about my city. Well, people in my town are really friendly and helpful. They're always willing to give you a hand when you need help. Also, Hanoi's cuisine is very diverse with a lot of delicious dishes such as Pho and Spring rolls.",
            "There are several aspects I really appreciate about my city. First and foremost, the food scene is incredible - you can find authentic street food vendors on almost every corner serving dishes that have been perfected over generations. The historical architecture is another highlight, with old colonial buildings standing alongside modern skyscrapers, creating a unique urban landscape. Additionally, the city has a vibrant cultural scene with numerous museums, theaters, and art galleries. What really makes it special though is the sense of community - neighbors still know each other and there's a strong tradition of helping one another.",
          ],
        },
        {
          q: "Do you want to live here in the near future?",
          models: [
            "To be honest, although it's quite ideal for me to live in my city now, I still want to move to another city in some developed country in the world. So I'm studying IELTS to make that dream come true.",
            "That's a thought-provoking question. While I'm very attached to my hometown and appreciate everything it offers, I'm also quite curious about experiencing life in other places. I think ideally, I'd like to spend a few years abroad for work or further education to broaden my horizons and gain international experience. However, I can definitely see myself returning to my city eventually, especially to be closer to family and friends. The familiarity and comfort of home is something that's hard to replace, even with all the excitement that living abroad might offer.",
          ],
        },
        {
          q: "Are you a patient person?",
          models: [
            "Yes I am. But I used to be a super hot-tempered kid who always got annoyed if someone kept me waiting even for 10 minutes.",
            "I would say I'm moderately patient, and it's something I've consciously worked on improving over the years. In my younger days, I was quite impatient and would get frustrated easily when things didn't go according to plan. However, through various life experiences and challenges, I've learned the value of patience. Now I'm much better at staying calm in stressful situations and understanding that some things simply take time. That being said, I still have moments where my patience is tested, particularly in situations I can't control.",
          ],
        },
        {
          q: "Have you ever lost your patience?",
          models: [
            "I sometimes lose my patience when I'm stuck in the traffic for hours after a hard day's work or I'm constantly interrupted by my family members while working in my room.",
            "Yes, definitely. Like most people, there are certain situations that really test my patience. One common scenario is when I'm dealing with slow internet connections, especially when I have urgent work to complete. Another situation is when I've explained something multiple times and the person still doesn't seem to understand - though I try to remind myself that everyone learns at their own pace. I've also lost my patience in customer service situations where I feel like I'm not being heard or taken seriously. However, I'm learning to recognize these triggers and manage my reactions better.",
          ],
        },
        {
          q: "When do you need patience the most?",
          models: [
            "Occasionally, not being able to keep your patience can cause undesirable results, for example, for studying English, you need to build up your knowledge day by day, sometimes you have to take some rest. So, I think I need to be patient when I learn a new language.",
            "I need patience most when I'm working on long-term goals that require consistent effort without immediate results. For instance, when learning a new skill or studying for important exams, it's crucial to maintain patience because progress is often gradual and not always visible day-to-day. I also need significant patience when dealing with complex problems at work that require careful analysis and can't be rushed. Additionally, patience is essential when collaborating with others, especially in group projects where different people work at different paces and have varying perspectives. In these situations, rushing or becoming frustrated usually makes things worse rather than better.",
          ],
        },
      ],
    },
    part2: {
      title: "Part 2: Individual Long Turn",
      duration: "3-4 minutes (1 min prep + 2 min talk)",
      instructions:
        "Prepare for 1 minute, then speak for 2 minutes. Select a model answer to emulate.",
      topic: "Describe a good law in your country",
      points: [
        "What the law is",
        "How you first learned about the law",
        "Who the law affects",
        "And explain why it is a good law (what would happen without it?)",
      ],
      models: [
        "Today I'm going to talk about a law that I find very effective in my country. It is about banning people from throwing garbage in public places.\n\nA few days ago, I heard the news broadcast on VTV1 Channel that this law had been enacted after the Environmental Protection Conference last month. It says that no one is allowed to litter in public sites, especially tourist attractions. If anyone is caught throwing rubbish in such places, he or she must pay a fine of about 1 million to 5 million VND, which is a huge amount of money. In case a person is reported to have broken the law, the one who reported may receive a bonus of 5 million, of course, with proper evidence only.\n\nAfter this law came into force and some people were reported, the strict punishment and strong criticism from the media as well have discouraged citizens from throwing rubbish everywhere they went. Also, the stunning views and natural landscapes of some famous tourist attractions in Vietnam have been protected. There are also fewer complaints from tourists about so much litter such as used cans and bottles appearing on the beach. And the most important thing is citizens' awareness of protecting the environment has greatly improved.",
        "I'd like to discuss the motorcycle helmet law in Vietnam, which I believe is an excellent example of effective legislation that has saved countless lives.\n\nI first became aware of this law when I was quite young, around 10 years old, when it was introduced nationwide. There was a massive public awareness campaign with billboards, television advertisements, and even school programs educating people about the importance of wearing helmets. The law requires all motorcycle riders and passengers to wear approved safety helmets at all times when traveling on public roads.\n\nThis law affects virtually everyone in Vietnam because motorcycles are the primary mode of transportation for millions of people. Whether you're a student commuting to school, a worker heading to the office, or a parent taking children around, you must wear a helmet. Police officers are authorized to stop and fine anyone not complying with this regulation.\n\nI believe this is an excellent law for several crucial reasons. Firstly, it has dramatically reduced the number of fatal head injuries in traffic accidents. Before this law, head trauma was the leading cause of death in motorcycle accidents. Secondly, it has created a culture of safety awareness - people now understand that protecting yourself on the road is not optional. Without this law, we would undoubtedly see significantly higher rates of death and serious injury from traffic accidents. The law has also had a positive economic impact by reducing healthcare costs associated with treating severe head injuries. Most importantly, it has saved families from the devastating loss of loved ones in preventable accidents.",
      ],
    },
    part3: {
      title: "Part 3: Two-way Discussion",
      duration: "4-5 minutes",
      instructions:
        "Discuss more abstract questions. These require deeper analysis.",
      questions: [
        {
          q: "What are the necessary qualities for someone to become a judge?",
          models: [
            "I think there are many essential characteristics of a good judge. First, a judge should be fair. Because he is the representative of justice, I suppose fairness is the first quality that matters. Besides, he needs to be wise to apply the laws properly and suitably according to different cases. Sometimes, it's important that the judge understands the real story behind what is told.",
            "Becoming a judge requires a unique combination of qualities and characteristics. First and foremost, integrity is absolutely essential - a judge must be incorruptible and committed to upholding justice regardless of external pressures. They need exceptional analytical skills to interpret complex legal texts and understand the nuances of each case. Impartiality is another critical quality; judges must set aside personal biases and make decisions based purely on facts and law. Additionally, they should possess strong communication skills to explain their decisions clearly and ensure all parties understand the reasoning behind verdicts. Patience is also vital, as legal proceedings can be lengthy and complicated. Furthermore, a good judge should have empathy - not to let it cloud their judgment, but to understand the human impact of their decisions. Finally, they need comprehensive legal knowledge gained through years of study and experience in the legal field.",
          ],
        },
        {
          q: "What are the necessary qualities for someone to become a lawyer?",
          models: [
            "In my opinion, a lawyer needs to be honest and have a deep understanding of the laws. To be more specific, a lawyer should always provide the exact information on their clients' situation, then give them the best advice on what they should do. A lawyer also needs to understand the law thoroughly so that he can protect his clients' rights or reduce the severity of their sentences.",
            "The legal profession demands a diverse set of skills and personal qualities. Primarily, lawyers must have excellent research and analytical abilities to examine cases thoroughly, identify relevant precedents, and construct compelling arguments. Strong communication skills are crucial - lawyers need to articulate complex legal concepts in ways that clients, judges, and juries can understand. They should also be persuasive advocates who can present their cases convincingly. Attention to detail is another essential quality, as missing a small detail in a contract or case file could have serious consequences. Lawyers must also demonstrate high ethical standards and professional integrity, as they're bound by strict codes of conduct. Time management and organizational skills are vital given the demanding workload and tight deadlines in legal practice. Additionally, successful lawyers need resilience and stress management abilities, as the profession can be highly pressured. Finally, continuous learning is important, as laws constantly evolve and lawyers must stay updated with new legislation and legal precedents.",
          ],
        },
        {
          q: "Are there any circumstances when the law should be broken?",
          models: [
            "I think in some cases, the law can be broken. For example, in my country, it is against the law to run a red light, but ambulances are allowed to do so. So I think that it is necessary to violate the traffic laws if a person is carrying a patient whose life is being threatened.",
            "This is quite a complex ethical question. Generally speaking, I believe laws exist for good reasons and should be respected. However, I think there are rare circumstances where breaking the law might be morally justifiable. The most clear-cut examples involve emergency situations where breaking a law could save lives - for instance, speeding to rush someone to hospital in a medical emergency, or emergency vehicles violating traffic rules to reach people in danger. There's also the concept of civil disobedience, where people deliberately break unjust laws to bring attention to them and advocate for change - historical examples include the civil rights movement. However, I want to emphasize that these should be exceptional circumstances. In most cases, if we disagree with a law, the proper course of action is to work through democratic processes to change it rather than simply breaking it. The rule of law is fundamental to a functioning society, and if everyone decided which laws to follow based on personal judgment, it would lead to chaos. So while there might be extreme situations that justify breaking laws, they should be very rare exceptions rather than the rule.",
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
                test_number: 4,
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

export default SpeakingTest4;