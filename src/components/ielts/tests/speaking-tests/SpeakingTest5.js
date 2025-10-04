// src/components/ielts/tests/SpeakingTest5.js
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

const SpeakingTest5 = ({ onComplete, onExit }) => {
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
          q: "What is your favourite colour?",
          models: [
            "When I was growing up, I guess blue was my favourite colour. I don't know why, but I always really liked things that were dark blue. These days though, I tend to have a preference for green things. So I suppose green and blue are the colours that I like most.",
            "My favourite colour is probably burgundy or deep red. I've always been drawn to rich, warm colours rather than cool tones. I think it's because these colours feel sophisticated and elegant to me. I find that I naturally gravitate towards clothing and home decor items in these shades. When I was younger, I preferred brighter colours like yellow and orange, but my tastes have evolved over time to appreciate more muted, deeper tones.",
          ],
        },
        {
          q: "Did you like that colour when you were small?",
          models: [
            "As I mentioned, I always liked dark blue when I was young, but green is something that I started to like just couple of years ago.",
            "Not really, actually. As a child, I was much more attracted to bright, primary colours like red and yellow. I think most children tend to prefer vibrant, eye-catching colours. My appreciation for my current favourite colour developed gradually as I got older and my aesthetic preferences matured. It's interesting how our tastes change as we age - what appeals to us as children often differs quite significantly from what we like as adults.",
          ],
        },
        {
          q: "Is the colour of your car or motorbike important? Why?",
          models: [
            "Yes, and no. I mean, I don't really care what colour it is; however, I wouldn't really like to have a pink motorbike. Pink is a little bit too feminine for me. These days I have a black motorbike, which I think is a good colour for it.",
            "I'd say it's moderately important to me. While it's not the primary factor in choosing a vehicle - reliability and performance matter more - I do think the colour contributes to the overall aesthetic appeal. I prefer neutral colours like black, white, or silver for vehicles because they're classic, easy to maintain, and tend to retain their value better. Bright or unusual colours might be fun initially, but I think they could become tiresome over time, and they might also make the vehicle harder to resell.",
          ],
        },
        {
          q: "What do you do in the morning?",
          models: [
            "So normally I like to wake up around 7am, have a light breakfast, and do some household chores, like wash the dishes or sweep the floor, or something like that. Then I usually do some exercise for an hour or two and have a second breakfast at about 9.30. After that, I have some spare time to do other things, like my hobbies, or some other things that I need to get done.",
            "My morning routine is fairly structured. I typically wake up around 6:30am and start with a glass of water to hydrate. Then I spend about 30 minutes doing some light stretching or yoga, which really helps me feel energized for the day. After that, I shower and get ready while listening to a podcast or the news. I always make time for a proper breakfast - usually something with protein and fruit - because I've found that eating well in the morning significantly impacts my energy levels throughout the day. Before starting work, I also like to review my schedule and prioritize my tasks for the day.",
          ],
        },
        {
          q: "Have you ever changed your routine?",
          models: [
            "Of course. I mean, my routine depends on my work. These days I work as an English teacher which requires me to work in the afternoon and evening, so I have plenty of free time in the morning. But in the past I used to have a nine-to-five job, so my routine was completely different then.",
            "Yes, several times actually. My routine has evolved significantly based on different life circumstances. When I was a student, I would often stay up late studying and wake up later in the morning. After I started working, I had to adjust to waking up much earlier to commute to the office. More recently, with the rise of remote work, I've had more flexibility in my schedule, which has allowed me to optimize my routine based on when I'm most productive. I've also made conscious changes, like incorporating meditation or exercise, after realizing their benefits for my mental and physical health.",
          ],
        },
        {
          q: "Do you often have breakfast?",
          models: [
            "Yeah, every day. My brain can't function properly without a good breakfast. In fact, as I mentioned before, I usually have two breakfasts, a light breakfast when I wake up, and then a bigger breakfast around 9 or 10am. I don't know how people live without breakfasts.",
            "Absolutely, I never skip breakfast. I've always believed that breakfast is the most important meal of the day, and I've personally experienced the difference it makes in my energy and concentration levels. On days when I've had to skip breakfast due to time constraints, I've noticed I feel sluggish and find it harder to focus. I usually have something substantial like eggs with whole grain toast, or oatmeal with fruits and nuts. I think establishing a healthy breakfast habit is one of the best things people can do for their overall wellbeing.",
          ],
        },
      ],
    },
    part2: {
      title: "Part 2: Individual Long Turn",
      duration: "3-4 minutes (1 min prep + 2 min talk)",
      instructions:
        "Prepare for 1 minute, then speak for 2 minutes. Select a model answer to emulate.",
      topic: "Describe an interesting old person",
      points: [
        "Who was the person",
        "How you met that person",
        "Where you met him or her",
        "And explain why you find them interesting",
      ],
      models: [
        "The old person that I find interesting that I would like to tell you about is my grandma. Actually, she died a few years ago but she was a very inspiring person. My earliest memories of her are probably from when I was about 5 or 6 years old, because before that I didn't live with my grandparents so I didn't see them very often.\n\nThere are many reasons why I think she was very interesting. Firstly, she grew up in Australia during a time when men and women did not have equal rights, especially in terms of salary, and she used to work in a leather factory and she knew that she was good at her job, better than a lot of the men in the factory. So one day, she demanded that her boss pay her the same wage as her male colleagues because she was better than a lot of them. This was a brave thing to do and her boss gave her a raise. I think this is a good example of her personality actually. She was an honest and fair person, she worked hard and she expected to be paid fairly.\n\nShe always really loved to live in old houses in the countryside and filled them with all sorts of antiques and lots of interesting gadgets, so it was quite fascinating for me and my brothers to visit her house when we were young. Secondly, my grandmother was a real individual. She loved to play video games even when she was 60 years old, and she used to ride a big motorcycle and she had some tattoos on her arms, which was very uncommon for a woman her age. But my brothers and I thought she was really cool. She was also a very talented artist as well. She painted many beautiful paintings, and learnt to play the piano when she was about 65. And because of these things, my grandmother is someone I really admired.",
        "I'd like to talk about Mr. Nguyen, an elderly gentleman I met at a community center about two years ago when I started volunteering there.\n\nMr. Nguyen is in his early eighties now, and what immediately struck me about him was his incredible energy and enthusiasm for life despite his age. I first encountered him during a community event where he was teaching traditional Vietnamese calligraphy to a group of young children. His patience and gentle teaching style were remarkable, and I was impressed by how engaged the children were with his lessons.\n\nWhat makes Mr. Nguyen particularly interesting is his life story and his attitude toward aging. He lived through the Vietnam War and experienced tremendous hardships, including losing his home and being separated from his family for several years. Despite these traumatic experiences, he maintains an incredibly positive outlook on life. He often tells fascinating stories about old Hanoi and how the city has transformed over the decades. His memory is sharp, and he can recall specific details about events from sixty years ago with remarkable clarity.\n\nWhat I find most inspiring about him is his commitment to lifelong learning. Even at his age, he's learning to use a computer and smartphone so he can video call his grandchildren who live abroad. He attends English classes at the community center and practices with younger volunteers like myself. He's also an avid reader and always has a book recommendation to share. His philosophy is that age is just a number, and as long as your mind stays active, you can continue growing and learning.\n\nMr. Nguyen has taught me that getting older doesn't mean giving up on new experiences or becoming set in your ways. His curiosity, resilience, and willingness to embrace change are qualities I hope to carry with me as I age. He's become not just someone I volunteer with, but a mentor and friend whose wisdom I deeply value.",
      ],
    },
    part3: {
      title: "Part 3: Two-way Discussion",
      duration: "4-5 minutes",
      instructions:
        "Discuss more abstract questions. These require deeper analysis.",
      questions: [
        {
          q: "Can old and young people share the same interests?",
          models: [
            "Yes of course. There are many interests that young and old people share. For example, many young and old people like to play the same sports, such as badminton, or the same games, like chess. It really just depends on each person's personalities.",
            "Absolutely, I think there are numerous interests that transcend age boundaries. While there might be some generational differences in preferences, the core activities themselves can appeal to people of all ages. For instance, both young and old people can enjoy music, though they might prefer different genres. Similarly, activities like hiking, gardening, cooking, or reading can be appreciated by anyone regardless of age. What's particularly interesting is how technology has created new common ground - many elderly people now enjoy video games or social media, activities traditionally associated with younger generations. I think the key is finding common interests that focus on the activity itself rather than age-specific trends. When people connect over shared passions, age becomes much less relevant.",
          ],
        },
        {
          q: "What can old people teach the youth?",
          models: [
            "Well, I suppose there are plenty of things the older generations can teach the youth. For example, older people usually have a lot of life experience and have learnt a lot of important life lessons which they can teach younger people about. In Vietnam, most older people experienced a lot of hardships in their lives when they were young, because the country was involved in a lot of wars, and many people didn't have jobs or money or even food, so they had to learn to survive and overcome those difficult times. Most kids these days don't have to deal with anything like that, so there are many things they could learn from their elders.",
            "Elderly people have a wealth of knowledge and experience that can be invaluable to younger generations. First and foremost, they can provide historical perspective and context that helps young people understand how society has evolved. They've witnessed significant social, political, and technological changes firsthand, which gives them unique insights into patterns of change and continuity. Older people can also teach important life skills that aren't always emphasized in modern education, such as patience, resilience in the face of adversity, and the value of face-to-face communication. They often have traditional skills - like cooking, craftwork, or gardening - that might otherwise be lost. Perhaps most importantly, elderly people can share wisdom about relationships, work-life balance, and what truly matters in life. Having lived through various life stages, they can offer perspective on challenges that young people face, helping them understand that many difficulties are temporary. Their stories and experiences serve as valuable lessons about human nature, decision-making, and the consequences of our choices.",
          ],
        },
        {
          q: "What can young people teach the old?",
          models: [
            "Well, I guess the first thing that springs to mind is about how to use technology. Many older people tend to be living behind the times so they tend to have a hard time learning how to use modern computers and other devices, like smartphones and so on, so that's one thing they can learn from the youth. Also, I guess many older people still hold on to some traditional beliefs and customs, some of which are a bit out-dated, while the youth are usually in the know when it comes to modern ways of living and more modern views and opinions about certain aspects of life. So I guess both generations have something to learn from each other.",
            "Young people bring fresh perspectives and skills that can be equally valuable to older generations. The most obvious area is technology - younger people who have grown up with digital devices can help elderly people navigate smartphones, computers, and the internet, which can significantly improve their quality of life by helping them stay connected with family, access information, and manage daily tasks more efficiently. Beyond technology, young people can introduce older generations to new cultural trends, music, and forms of entertainment that keep them engaged with contemporary society. They can also share more progressive attitudes about social issues like environmental conservation, mental health awareness, and social equality. Young people often have a more global perspective due to increased connectivity and international exposure, which can broaden older people's worldviews. Additionally, the enthusiasm and energy of youth can be infectious, encouraging older people to try new activities, visit new places, or pick up new hobbies they might not have considered. Perhaps most importantly, intergenerational exchange works both ways - it's through these mutual teaching moments that both groups can challenge their assumptions, reduce stereotypes, and build stronger, more understanding communities.",
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
                test_number: 5,
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

export default SpeakingTest5;