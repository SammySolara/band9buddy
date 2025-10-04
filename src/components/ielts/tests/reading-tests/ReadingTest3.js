import { useState, useRef, useEffect } from "react";
import {
  Clock,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";

const TOTAL_TIME = 3600;

const ReadingTest3 = ({ onComplete, onExit }) => {
  const { user, session } = useAuth();

  const [currentPassage, setCurrentPassage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const timerRef = useRef(null);

  const answerKey = {
    1: "tail",
    2: "flippers",
    3: "hairs",
    4: "seagrasses",
    5: "lips",
    6: "buoyancy",
    7: "TRUE",
    8: "NOT GIVEN",
    9: "FALSE",
    10: "NOT GIVEN",
    11: "TRUE",
    12: "NOT GIVEN",
    13: "TRUE",
    14: "B",
    15: "F",
    16: "B",
    17: "laziness",
    18: "anxious",
    19: "threats",
    20: "exams",
    21: "perfectionists",
    22: "guilt",
    23: "A",
    24: "C",
    25: "A",
    26: "E",
    27: "NO",
    28: "YES",
    29: "NOT GIVEN",
    30: "NO",
    31: "NOT GIVEN",
    32: "YES",
    33: "F",
    34: "D",
    35: "H",
    36: "B",
    37: "G",
    38: "B",
    39: "D",
    40: "C",
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPassage]);

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
            test_type: "reading",
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

  const renderPassage1 = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-2xl font-bold mb-4">Manatees</h3>
        <div className="prose max-w-none space-y-4 text-gray-700">
          <p>
            Manatees, also known as sea cows, are aquatic mammals that belong to
            a group of animals called Sirenia. This group also contains dugongs.
            Dugongs and manatees look quite alike – they are similar in size,
            colour and shape, and both have flexible flippers for forelimbs.
            However, the manatee has a broad, rounded tail, whereas the dugong's
            is fluked, like that of a whale. There are three species of
            manatees: the West Indian manatee (Trichechus manatus), the African
            manatee (Trichechus senegalensis) and the Amazonian manatee
            (Trichechus inunguis).
          </p>
          <p>
            Unlike most mammals, manatees have only six bones in their neck –
            most others, including humans and giraffes, have seven. This short
            neck allows a manatee to move its head up and down, but not side to
            side. To see something on its left or its right, a manatee must turn
            its entire body, steering with its flippers. Manatees have pectoral
            flippers but no back limbs, only a tail for propulsion. They do have
            pelvic bones, however – a leftover from their evolution from a
            four-legged to a fully aquatic animal. Manatees share some visual
            similarities to elephants. Like elephants, manatees have thick,
            wrinkled skin. They also have some hairs covering their bodies which
            help them sense vibrations in the water around them.
          </p>
          <p>
            Seagrasses and other marine plants make up most of a manatee's diet.
            Manatees spend about eight hours each day grazing and uprooting
            plants. They eat up to 15% of their weight in food each day. African
            manatees are omnivorous – studies have shown that molluscs and fish
            make up a small part of their diets. West Indian and Amazonian
            manatees are both herbivores.
          </p>
          <p>
            Manatees' teeth are all molars – flat, rounded teeth for grinding
            food. Due to manatees' abrasive aquatic plant diet, these teeth get
            worn down and they eventually fall out, so they continually grow new
            teeth that get pushed forward to replace the ones they lose. Instead
            of having incisors to grasp their food, manatees have lips which
            function like a pair of hands to help tear food away from the
            seafloor.
          </p>
          <p>
            Manatees are fully aquatic, but as mammals, they need to come up to
            the surface to breathe. When awake, they typically surface every two
            to four minutes, but they can hold their breath for much longer.
            Adult manatees sleep underwater for 10-12 hours a day, but they come
            up for air every 15-20 minutes. Active manatees need to breathe more
            frequently. It's thought that manatees use their muscular diaphragm
            and breathing to adjust their buoyancy. They may use diaphragm
            contractions to compress and store gas in folds in their large
            intestine to help them float.
          </p>
          <p>
            The West Indian manatee reaches about 3.5 metres long and weighs on
            average around 500 kilogrammes. It moves between fresh water and
            salt water, taking advantage of coastal mangroves and coral reefs,
            rivers, lakes and inland lagoons. There are two subspecies of West
            Indian manatee: the Antillean manatee is found in waters from the
            Bahamas to Brazil, whereas the Florida manatee is found in US
            waters, although some individuals have been recorded in the Bahamas.
            In winter, the Florida manatee is typically restricted to Florida.
            When the ambient water temperature drops below 20°C, it takes refuge
            in naturally and artificially warmed water, such as at the
            warm-water outfalls from powerplants.
          </p>
          <p>
            The African manatee is also about 3.5 metres long and found in the
            sea along the west coast of Africa, from Mauritania down to Angola.
            The species also makes use of rivers, with the mammals seen in
            landlocked countries such as Mali and Niger. The Amazonian manatee
            is the smallest species, though it is still a big animal. It grows
            to about 2.5 metres long and 350 kilogrammes. Amazonian manatees
            favour calm, shallow waters that are above 23°C. This species is
            found in fresh water in the Amazon Basin in Brazil, as well as in
            Colombia, Ecuador and Peru.
          </p>
          <p>
            All three manatee species are endangered or at a heightened risk of
            extinction. The African manatee and Amazonian manatee are both
            listed as Vulnerable by the International Union for Conservation of
            Nature (IUCN). It is estimated that 140,000 Amazonian manatees were
            killed between 1935 and 1954 for their meat, fat and skin with the
            latter used to make leather. In more recent years, African manatee
            decline has been tied to incidental capture in fishing nets and
            hunting. Manatee hunting is now illegal in every country the African
            species is found in.
          </p>
          <p>
            The two subspecies of West Indian manatee are listed as Endangered
            by the IUCN. Both are also expected to undergo a decline of 20% over
            the next 40 years. A review of almost 1,800 cases of entanglement in
            fishing nets and of plastic consumption among marine mammals in US
            waters from 2009 to 2020 found that at least 700 cases involved
            manatees. The chief cause of death in Florida manatees is boat
            strikes. However, laws in certain parts of Florida now limit boat
            speeds during winter, allowing slow-moving manatees more time to
            respond.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 1-6</h3>
        <p className="text-blue-800 text-sm">
          Complete the notes below. Choose ONE WORD AND/OR A NUMBER from the
          passage for each answer.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold mb-4">Manatees</h4>
        <div className="space-y-4">
          <div>
            <h5 className="font-semibold mb-2">Appearance</h5>
            <p>
              • look similar to dugongs, but with a differently shaped{" "}
              <input
                type="text"
                value={answers[1] || ""}
                onChange={(e) => handleAnswerChange(1, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="1"
              />
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Movement</h5>
            <p>• have fewer neck bones than most mammals</p>
            <p>
              • need to use their{" "}
              <input
                type="text"
                value={answers[2] || ""}
                onChange={(e) => handleAnswerChange(2, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="2"
              />{" "}
              to help to turn their bodies around in order to look sideways
            </p>
            <p>
              • sense vibrations in the water by means of{" "}
              <input
                type="text"
                value={answers[3] || ""}
                onChange={(e) => handleAnswerChange(3, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="3"
              />{" "}
              on their skin
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Feeding</h5>
            <p>
              • eat mainly aquatic vegetation, such as{" "}
              <input
                type="text"
                value={answers[4] || ""}
                onChange={(e) => handleAnswerChange(4, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="4"
              />
            </p>
            <p>
              • grasp and pull up plants with their{" "}
              <input
                type="text"
                value={answers[5] || ""}
                onChange={(e) => handleAnswerChange(5, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="5"
              />
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Breathing</h5>
            <p>
              • come to the surface for air every 2-4 minutes when awake and
              every 15-20 while sleeping
            </p>
            <p>
              • may regulate the{" "}
              <input
                type="text"
                value={answers[6] || ""}
                onChange={(e) => handleAnswerChange(6, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="6"
              />{" "}
              of their bodies by using muscles of diaphragm to store air
              internally
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 7-13</h3>
        <p className="text-blue-800 text-sm">
          Do the following statements agree with the information given in
          Reading Passage 1?
          <br />
          Write TRUE if the statement agrees with the information
          <br />
          FALSE if the statement contradicts the information
          <br />
          NOT GIVEN if there is no information on this
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            q: 7,
            text: "West Indian manatees can be found in a variety of different aquatic habitats.",
          },
          {
            q: 8,
            text: "The Florida manatee lives in warmer waters than the Antillean manatee.",
          },
          {
            q: 9,
            text: "The African manatee's range is limited to coastal waters between the West African countries of Mauritania and Angola.",
          },
          {
            q: 10,
            text: "The extent of the loss of Amazonian manatees in the mid-twentieth century was only revealed many years later.",
          },
          {
            q: 11,
            text: "It is predicted that West Indian manatee populations will fall in the coming decades.",
          },
          {
            q: 12,
            text: "The risk to manatees from entanglement and plastic consumption increased significantly in the period 2009-2020.",
          },
          {
            q: 13,
            text: "There is some legislation in place which aims to reduce the likelihood of boat strikes on manatees in Florida.",
          },
        ].map(({ q, text }) => (
          <div key={q} className="bg-white p-4 rounded-lg border">
            <p className="font-semibold mb-3">
              {q}. {text}
            </p>
            <div className="space-y-2">
              {["TRUE", "FALSE", "NOT GIVEN"].map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`q${q}`}
                    value={opt}
                    onChange={(e) => handleAnswerChange(q, e.target.value)}
                    checked={answers[q] === opt}
                    className="w-4 h-4"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPassage2 = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-2xl font-bold mb-4">Procrastination</h3>
        <h4 className="text-lg italic mb-4">
          A psychologist explains why we put off important tasks and how we can
          break this habit
        </h4>
        <div className="prose max-w-none space-y-4 text-gray-700">
          <div>
            <h4 className="font-bold mb-2">A</h4>
            <p>
              Procrastination is the habit of delaying a necessary task, usually
              by focusing on less urgent, more enjoyable, and easier activities
              instead. We all do it from time to time. We might be composing a
              message to a friend who we have to let down, or putting together
              an important report for college or work; we're doing our best to
              avoid doing the job at hand, but deep down we know that we should
              just be getting on with it. Unfortunately, berating ourselves
              won't stop us procrastinating again. In fact, it's one of the
              worst things we can do. This matters because, as my research
              shows, procrastination doesn't just waste time, but is actually
              linked to other problems, too.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">B</h4>
            <p>
              Contrary to popular belief, procrastination is not due to laziness
              or poor time management. Scientific studies suggest
              procrastination is, in fact, caused by poor mood management. This
              makes sense if we consider that people are more likely to put off
              starting or completing tasks that they are really not keen to do.
              If just thinking about the task threatens our sense of self-worth
              or makes us anxious, we will be more likely to put it off.
              Research involving brain imaging has found that areas of the brain
              linked to detection of threats and emotion regulation are actually
              different in people who chronically procrastinate compared to
              those who don't procrastinate frequently.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">C</h4>
            <p>
              Tasks that are emotionally loaded or difficult, such as preparing
              for exams, are prime candidates for procrastination. People with
              low self-esteem are more likely to procrastinate. Another group of
              people who tend to procrastinate are perfectionists, who worry
              their work will be judged harshly by others. We know that if we
              don't finish that report or complete those home repairs, then what
              we did can't be evaluated. When we avoid such tasks, we also avoid
              the negative emotions associated with them. This is rewarding, and
              it conditions us to use procrastination to repair our mood. If we
              engage in more enjoyable tasks instead, we get another mood boost.
              In the long run, however, procrastination isn't an effective way
              of managing emotions. The 'mood repair' we experience is
              temporary. Afterwards, people tend to be left with a sense of
              guilt that not only increases their negative mood, but also
              reinforces their tendency to procrastinate.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">D</h4>
            <p>
              So why is this such a problem? When most people think of the costs
              of procrastination, they think of the toll on productivity. For
              example, studies have shown that procrastination negatively
              impacts on student performance. But putting off reading textbooks
              and writing essays may affect other areas of students' lives. In
              one study of over 3,000 German students over a six-month period,
              those who reported procrastinating over their university work were
              also more likely to engage in study-related misconduct, such as
              cheating and plagiarism. But the behaviour that procrastination
              was most closely linked with was using fraudulent excuses to get
              deadline extensions. Other research shows that employees on
              average spend almost a quarter of their workday procrastinating,
              and again this is linked with negative outcomes. In fact, in one
              US survey of over 22,000 employees, participants who said they
              regularly procrastinated had less annual income and less
              employment stability. For every one-point increase on a measure of
              chronic procrastination, annual income decreased by US$15,000.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">E</h4>
            <p>
              Procrastination also correlates with serious health and well-being
              problems. A tendency to procrastinate is linked to poor mental
              health, including higher levels of depression and anxiety. Across
              numerous studies, I've found people who regularly procrastinate
              report a greater number of health issues, such as headaches, flu
              and colds, and digestive issues. They also experience higher
              levels of stress and poor sleep quality. They are less likely to
              practise healthy behaviours, such as eating a healthy diet and
              regularly exercising, and use destructive coping strategies to
              manage their stress. In one study of over 700 people, I found
              people prone to procrastination had a 63% greater risk of poor
              heart health after accounting for other personality traits and
              demographics.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">F</h4>
            <p>
              Finding better ways of managing our emotions is one route out of
              the vicious cycle of procrastination. An important first step is
              to manage our environment and how we view the task. There are a
              number of evidence-based strategies that can help us fend off
              distractions that can occupy our minds when we should be focusing
              on the thing we should be getting on with. For example, reminding
              ourselves about why the task is important and valuable can
              increase positive feelings towards it. Forgiving ourselves and
              feeling compassion when we procrastinate can help break the
              procrastination cycle. We should admit that we feel bad, but not
              be overly critical of ourselves. We should remind ourselves that
              we're not the first person to procrastinate, nor the last. Doing
              this can take the edge off the negative feelings we have about
              ourselves when we procrastinate. This can all make it easier to
              get back on track.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 14-16</h3>
        <p className="text-blue-800 text-sm">
          Reading Passage 2 has six paragraphs, A–F. Which paragraph contains
          the following information? You may use any letter more than once.
        </p>
      </div>

      <div className="space-y-3">
        {[
          {
            q: 14,
            text: "mention of false assumptions about why people procrastinate",
          },
          {
            q: 15,
            text: "reference to the realisation that others also procrastinate",
          },
          {
            q: 16,
            text: "neurological evidence of a link between procrastination and emotion",
          },
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
              onChange={(e) =>
                handleAnswerChange(q, e.target.value.toUpperCase())
              }
              className="border rounded px-2 py-1 w-20"
              placeholder="A-F"
              maxLength={1}
            />
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 17-22</h3>
        <p className="text-blue-800 text-sm">
          Complete the summary below. Choose ONE WORD ONLY from the passage for
          each answer.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold mb-4">What makes us procrastinate?</h4>
        <div className="space-y-3">
          <p>
            Many people think that procrastination is the result of{" "}
            <input
              type="text"
              value={answers[17] || ""}
              onChange={(e) => handleAnswerChange(17, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="17"
            />
            . Others believe it to be the result of an inability to organise
            time efficiently.
          </p>
          <p>
            But scientific studies suggest that procrastination is actually due
            to poor mood management. The tasks we are most likely to put off are
            those that could damage our self-esteem or cause us to feel{" "}
            <input
              type="text"
              value={answers[18] || ""}
              onChange={(e) => handleAnswerChange(18, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="18"
            />{" "}
            when we think about them. Research comparing chronic procrastinators
            with other people even found differences in the brain regions
            associated with regulating emotions and identifying{" "}
            <input
              type="text"
              value={answers[19] || ""}
              onChange={(e) => handleAnswerChange(19, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="19"
            />
            .
          </p>
          <p>
            Emotionally loaded and difficult tasks often cause us to
            procrastinate. Getting ready to take{" "}
            <input
              type="text"
              value={answers[20] || ""}
              onChange={(e) => handleAnswerChange(20, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="20"
            />{" "}
            might be a typical example of one such task.
          </p>
          <p>
            People who are likely to procrastinate tend to be either{" "}
            <input
              type="text"
              value={answers[21] || ""}
              onChange={(e) => handleAnswerChange(21, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="21"
            />{" "}
            or those with low self-esteem.
          </p>
          <p>
            Procrastination is only a short-term measure for managing emotions.
            It's often followed by a feeling of{" "}
            <input
              type="text"
              value={answers[22] || ""}
              onChange={(e) => handleAnswerChange(22, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="22"
            />
            , which worsens our mood and leads to more procrastination.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          Questions 23 and 24
        </h3>
        <p className="text-blue-800 text-sm">
          Choose TWO letters, A–E. Which TWO comparisons between employees who
          often procrastinate and those who do not are mentioned in the text?
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <p className="mb-4 font-semibold">Select TWO answers:</p>
        <div className="space-y-2">
          {[
            { value: "A", text: "Their salaries are lower." },
            { value: "B", text: "The quality of their work is inferior." },
            { value: "C", text: "They don't keep their jobs for as long." },
            {
              value: "D",
              text: "They don't enjoy their working lives as much.",
            },
            {
              value: "E",
              text: "They have poorer relationships with colleagues.",
            },
          ].map(({ value, text }) => (
            <label
              key={value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                value={value}
                onChange={(e) => {
                  const current23 = answers[23] || "";
                  const current24 = answers[24] || "";
                  const selected = [current23, current24].filter((v) => v);

                  if (e.target.checked) {
                    if (selected.length < 2) {
                      if (!current23) {
                        handleAnswerChange(23, value);
                      } else {
                        handleAnswerChange(24, value);
                      }
                    }
                  } else {
                    if (current23 === value) {
                      handleAnswerChange(23, current24);
                      handleAnswerChange(24, "");
                    } else if (current24 === value) {
                      handleAnswerChange(24, "");
                    }
                  }
                }}
                checked={answers[23] === value || answers[24] === value}
                className="w-4 h-4"
              />
              <span>
                <strong>{value}</strong> {text}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          Questions 25 and 26
        </h3>
        <p className="text-blue-800 text-sm">
          Choose TWO letters, A–E. Which TWO recommendations for getting out of
          a cycle of procrastination does the writer give?
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <p className="mb-4 font-semibold">Select TWO answers:</p>
        <div className="space-y-2">
          {[
            { value: "A", text: "not judging ourselves harshly" },
            { value: "B", text: "setting ourselves manageable aims" },
            { value: "C", text: "rewarding ourselves for tasks achieved" },
            {
              value: "D",
              text: "prioritising tasks according to their importance",
            },
            {
              value: "E",
              text: "avoiding things that stop us concentrating on our tasks",
            },
          ].map(({ value, text }) => (
            <label
              key={value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                value={value}
                onChange={(e) => {
                  const current25 = answers[25] || "";
                  const current26 = answers[26] || "";
                  const selected = [current25, current26].filter((v) => v);

                  if (e.target.checked) {
                    if (selected.length < 2) {
                      if (!current25) {
                        handleAnswerChange(25, value);
                      } else {
                        handleAnswerChange(26, value);
                      }
                    }
                  } else {
                    if (current25 === value) {
                      handleAnswerChange(25, current26);
                      handleAnswerChange(26, "");
                    } else if (current26 === value) {
                      handleAnswerChange(26, "");
                    }
                  }
                }}
                checked={answers[25] === value || answers[26] === value}
                className="w-4 h-4"
              />
              <span>
                <strong>{value}</strong> {text}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPassage3 = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-2xl font-bold mb-4">
          Invasion of the Robot Umpires
        </h3>
        <div className="prose max-w-none space-y-4 text-gray-700">
          <p>
            A few years ago, Fred DeJesus from Brooklyn, New York became the
            first umpire in a minor league baseball game to use something called
            the Automated Ball-Strike System (ABS), often referred to as the
            'robo-umpire'. Instead of making any judgments himself about a
            strike, DeJesus had decisions fed to him through an earpiece,
            connected to a modified missile-tracking system. The contraption
            looked like a large black pizza box with one glowing green eye; it
            was mounted above the press stand.
          </p>
          <p>
            Major League Baseball (MLB), who had commissioned the system, wanted
            human umpires to announce the calls, just as they would have done in
            the past. When the first pitch came in, a recorded voice told
            DeJesus it was a strike. Previously, calling a strike was a judgment
            call on the part of the umpire. Even if the batter does not hit the
            ball, a pitch that passes through the 'strike zone' (an imaginary
            zone about seventeen inches wide, stretching from the batter's knees
            to the middle of his chest) is considered a strike. During that
            first game, when DeJesus announced calls, there was no heckling and
            no shouted disagreement. Nobody said a word.
          </p>
          <p>
            For a hundred and fifty years or so, the strike zone has been the
            game's animating force – countless arguments between a team's
            manager and the umpire have taken place over its boundaries and
            whether a ball had crossed through it. The rules of play have
            evolved in various stages. Today, everyone knows that you may scream
            your disagreement in an umpire's face, but you must never shout
            personal abuse at them or touch them. That's a no-no. When the
            robo-umpires came, however, the arguments stopped.
          </p>
          <p>
            During the first robo-umpire season, players complained about some
            strange calls. In response, MLB decided to tweak the dimensions of
            the zone, and the following year the consensus was that ABS is
            profoundly consistent. MLB says the device is near-perfect, precise
            to within fractions of an inch. "It'll reduce controversy in the
            game, and be good for the game," says Rob Manfred, who is
            Commissioner for MLB. But the question is whether controversy is
            worth reducing, or whether it is the sign of a human hand.
          </p>
          <p>
            A human, at least, yells back. When I spoke with Frank Viola, a
            coach for a North Carolina team, he said that ABS works as designed,
            but that it was also unforgiving and pedantic, almost legalistic.
            "Manfred is a lawyer," Viola noted. Some pitchers have complained
            that, compared with a human's, the robot's strike zone seems too
            precise. Viola was once a major-league player himself. When he was
            pitching, he explained, umpires rewarded skill. "Throw it where you
            aimed, and it would be a strike, even if it was an inch or two
            outside. There was a dialogue between pitcher and umpire."
          </p>
          <p>
            The executive tasked with running the experiment for MLB is Morgan
            Sword, who's in charge of baseball operations. According to Sword,
            ABS was part of a larger project to make baseball more exciting
            since executives are terrified of losing younger fans, as has been
            the case with horse racing and boxing. He explains how they began
            the process by asking fans what version of baseball they found most
            exciting. The results showed that everyone wanted more action: more
            hits, more defense, more baserunning. This type of baseball
            essentially hasn't existed since the 1960s, when the
            hundred-mile-an-hour fastball, which is difficult to hit and
            control, entered the game. It flattened the game into strikeouts,
            walks, and home runs – a type of play lacking much action.
          </p>
          <p>
            Sword's team brainstormed potential fixes. Any rule that existed,
            they talked about changing – from changing the bats to changing the
            geometry of the field. But while all of these were ruled out as
            potential fixes, ABS was seen as a perfect vehicle for change.
            According to Sword, once you get the technology right, you can load
            any strike zone you want into the system. "It might be a triangle,
            or a blob, or something shaped like Texas. Over time, as baseball
            evolves, ABS can allow the zone to change with it."
          </p>
          <p>
            In the past twenty years, sports have moved away from judgment
            calls. Soccer has Video Assistant Referees (for offside decisions,
            for example). Tennis has Hawk-Eye (for line calls, for example). For
            almost a decade, baseball has used instant replay on the base paths.
            This is widely liked, even if the precision can sometimes cause
            problems. But these applications deal with something physical:
            bases, lines, goals. The boundaries of action are precise,
            delineated like the keys of a piano. This is not the case with ABS
            and the strike zone. Historically, a certain discretion has been
            appreciated.
          </p>
          <p>
            I decided to email Alva Noë, a professor at Berkeley University and
            a baseball fan, for his opinion. "Hardly a day goes by that I don't
            wake up and run through the reasons that this [robo-umpires] is such
            a terrible idea," he replied. He later told me, "This is part of a
            movement to use algorithms to take the hard choices of living out of
            life." Perhaps he's right. We watch baseball to kill time, not to
            maximize it. Some players I have met take a dissenting stance toward
            the robots too, believing that accuracy is not the answer. According
            to Joe Russo, who plays for a New Jersey team, "With technology,
            people just want everything to be perfect. That's not reality. I
            think perfect would be weird. Your teams are always winning, work is
            always just great, there's always money in your pocket, your car
            never breaks down. What is there to talk about?"
          </p>
          <p className="text-sm italic mt-4">
            *strike: a strike is when the batter swings at a ball and misses or
            when the batter does not swing at a ball that passes through the
            strike zone.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 27-32</h3>
        <p className="text-blue-800 text-sm">
          Do the following statements agree with the claims of the writer in
          Reading Passage 3?
          <br />
          Write YES if the statement agrees with the claims of the writer
          <br />
          NO if the statement contradicts the claims of the writer
          <br />
          NOT GIVEN if it is impossible to say what the writer thinks about this
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            q: 27,
            text: "When DeJesus first used ABS, he shared decision-making about strikes with it.",
          },
          {
            q: 28,
            text: "MLB considered it necessary to amend the size of the strike zone when criticisms were received from players.",
          },
          {
            q: 29,
            text: "MLB is keen to justify the money spent on improving the accuracy of ABS's calculations.",
          },
          {
            q: 30,
            text: "The hundred-mile-an-hour fastball led to a more exciting style of play.",
          },
          {
            q: 31,
            text: "The differing proposals for alterations to the baseball bat led to fierce debate on Sword's team.",
          },
          {
            q: 32,
            text: "ABS makes changes to the shape of the strike zone feasible.",
          },
        ].map(({ q, text }) => (
          <div key={q} className="bg-white p-4 rounded-lg border">
            <p className="font-semibold mb-3">
              {q}. {text}
            </p>
            <div className="space-y-2">
              {["YES", "NO", "NOT GIVEN"].map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`q${q}`}
                    value={opt}
                    onChange={(e) => handleAnswerChange(q, e.target.value)}
                    checked={answers[q] === opt}
                    className="w-4 h-4"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 33-37</h3>
        <p className="text-blue-800 text-sm">
          Complete the summary using the list of phrases, A–H, below. Write the
          correct letter, A–H.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border mb-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>
            <strong>A</strong> pitch boundary
          </p>
          <p>
            <strong>B</strong> numerous disputes
          </p>
          <p>
            <strong>C</strong> team tactics
          </p>
          <p>
            <strong>D</strong> subjective assessment
          </p>
          <p>
            <strong>E</strong> widespread approval
          </p>
          <p>
            <strong>F</strong> former roles
          </p>
          <p>
            <strong>G</strong> total silence
          </p>
          <p>
            <strong>H</strong> perceived area
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold mb-4">Calls by the umpire</h4>
        <div className="space-y-3">
          <p>
            Even after ABS was developed, MLB still wanted human umpires to
            shout out decisions as they had in their{" "}
            <input
              type="text"
              value={answers[33] || ""}
              onChange={(e) =>
                handleAnswerChange(33, e.target.value.toUpperCase())
              }
              className="border rounded px-2 py-1 w-20 mx-1"
              placeholder="33"
              maxLength={1}
            />
            . The umpire's job had, at one time, required a{" "}
            <input
              type="text"
              value={answers[34] || ""}
              onChange={(e) =>
                handleAnswerChange(34, e.target.value.toUpperCase())
              }
              className="border rounded px-2 py-1 w-20 mx-1"
              placeholder="34"
              maxLength={1}
            />{" "}
            about whether a ball was a strike. A ball is considered a strike
            when the batter does not hit it and it crosses through a{" "}
            <input
              type="text"
              value={answers[35] || ""}
              onChange={(e) =>
                handleAnswerChange(35, e.target.value.toUpperCase())
              }
              className="border rounded px-2 py-1 w-20 mx-1"
              placeholder="35"
              maxLength={1}
            />{" "}
            extending approximately from the batter's knee to his chest.
          </p>
          <p>
            In the past,{" "}
            <input
              type="text"
              value={answers[36] || ""}
              onChange={(e) =>
                handleAnswerChange(36, e.target.value.toUpperCase())
              }
              className="border rounded px-2 py-1 w-20 mx-1"
              placeholder="36"
              maxLength={1}
            />{" "}
            over strike calls were not uncommon, but today everyone accepts the
            complete ban on pushing or shoving the umpire. One difference,
            however, is that during the first game DeJesus used ABS, strike
            calls were met with{" "}
            <input
              type="text"
              value={answers[37] || ""}
              onChange={(e) =>
                handleAnswerChange(37, e.target.value.toUpperCase())
              }
              className="border rounded px-2 py-1 w-20 mx-1"
              placeholder="37"
              maxLength={1}
            />
            .
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 38-40</h3>
        <p className="text-blue-800 text-sm">
          Choose the correct letter, A, B, C or D.
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            q: 38,
            text: "What does the writer suggest about ABS in the fifth paragraph?",
            options: [
              "It is bound to make key decisions that are wrong.",
              "It may reduce some of the appeal of the game.",
              "It will lead to the disappearance of human umpires.",
              "It may increase calls for the rules of baseball to be changed.",
            ],
          },
          {
            q: 39,
            text: "Morgan Sword says that the introduction of ABS",
            options: [
              "was regarded as an experiment without a guaranteed outcome.",
              "was intended to keep up with developments in other sports.",
              "was a response to changing attitudes about the role of sport.",
              "was an attempt to ensure baseball retained a young audience.",
            ],
          },
          {
            q: 40,
            text: "Why does the writer include the views of Noë and Russo?",
            options: [
              "to show that attitudes to technology vary widely",
              "to argue that people have unrealistic expectations of sport",
              "to indicate that accuracy is not the same thing as enjoyment",
              "to suggest that the number of baseball fans needs to increase",
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
            IELTS Reading Test 3 - Passage {currentPassage}
          </h2>
          <div
            className={`flex items-center gap-2 font-semibold text-lg p-2 rounded-md ${
              timeLeft < 600 ? "text-red-600 bg-red-100" : "text-gray-700"
            }`}
          >
            <Clock className="h-5 w-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="mb-6">
          {currentPassage === 1 && renderPassage1()}
          {currentPassage === 2 && renderPassage2()}
          {currentPassage === 3 && renderPassage3()}
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <button
            onClick={() => setCurrentPassage(Math.max(1, currentPassage - 1))}
            disabled={currentPassage === 1}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          {currentPassage < 3 ? (
            <button
              onClick={() => setCurrentPassage(currentPassage + 1)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Next Passage <ChevronRight className="h-4 w-4" />
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
    <div className="max-w-5xl mx-auto">
      {showResults ? renderResults() : renderTest()}
    </div>
  );
};

export default ReadingTest3;
