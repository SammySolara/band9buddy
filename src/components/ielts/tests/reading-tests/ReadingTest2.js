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

const ReadingTest2 = ({ onComplete, onExit }) => {
  const { user, session } = useAuth();

  const [currentPassage, setCurrentPassage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const timerRef = useRef(null);

  const answerKey = {
    1: "B",
    2: "C",
    3: "F",
    4: "D",
    5: "E",
    6: "A",
    7: "Safety",
    8: "Traffic",
    9: "Carriageway",
    10: "Mobile",
    11: "Dangerous",
    12: "Communities",
    13: "Healthy",
    14: "F",
    15: "B",
    16: "D",
    17: "G",
    18: "Genetic Traits",
    19: "Heat Loss",
    20: "Ear",
    21: "Insulating Fat",
    22: "Carbon Emissions",
    23: "B",
    24: "C",
    25: "A",
    26: "C",
    27: "C",
    28: "A",
    29: "B",
    30: "B",
    31: "D",
    32: "F",
    33: "H",
    34: "C",
    35: "D",
    36: "E",
    37: "NOT GIVEN",
    38: "TRUE",
    39: "FALSE",
    40: "FALSE",
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

  const renderPassage1 = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-2xl font-bold mb-4">
          Could urban engineers learn from dance?
        </h3>
        <div className="prose max-w-none space-y-4 text-gray-700">
          <div>
            <h4 className="font-bold mb-2">A</h4>
            <p>
              The way we travel around cities has a major impact on whether they
              are sustainable. Transportation is estimated to account for 30% of
              energy consumption in most of the world's most developed nations,
              so lowering the need for energy-using vehicles is essential for
              decreasing the environmental impact of mobility. But as more and
              more people move to cities, it is important to think about other
              kinds of sustainable travel too. The ways we travel affect our
              physical and mental health, our social lives, our access to work
              and culture, and the air we breathe. Engineers are tasked with
              changing how we travel round cities through urban design, but the
              engineering industry still works on the assumptions that led to
              the creation of the energy-consuming transport systems we have
              now: the emphasis placed solely on efficiency, speed, and
              quantitative data. We need radical changes, to make it healthier,
              more enjoyable, and less environmentally damaging to travel around
              cities.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">B</h4>
            <p>
              Dance might hold some of the answers. That is not to suggest
              everyone should dance their way to work, however healthy and happy
              it might make us, but rather that the techniques used by
              choreographers to experiment with and design movement in dance
              could provide engineers with tools to stimulate new ideas in
              city-making. Richard Sennett, an influential urbanist and
              sociologist who has transformed ideas about the way cities are
              made, argues that urban design has suffered from a separation
              between mind and body since the introduction of the architectural
              blueprint.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">C</h4>
            <p>
              Whereas medieval builders improvised and adapted construction
              through their intimate knowledge of materials and personal
              experience of the conditions on a site, building designs are now
              conceived and stored in media technologies that detach the
              designer from the physical and social realities they are creating.
              While the design practices created by these new technologies are
              essential for managing the technical complexity of the modern
              city, they have the drawback of simplifying reality in the
              process.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">D</h4>
            <p>
              To illustrate, Sennett discusses the Peachtree Center in Atlanta,
              USA, a development typical of the modernist approach to urban
              planning prevalent in the 1970s. Peachtree created a grid of
              streets and towers intended as a new pedestrian-friendly downtown
              for Atlanta. According to Sennett, this failed because its
              designers had invested too much faith in computer-aided design to
              tell them how it would operate. They failed to take into account
              that purpose-built street cafés could not operate in the hot sun
              without the protective awnings common in older buildings, and
              would need energy-consuming air conditioning instead, or that its
              giant car park would feel so unwelcoming that it would put people
              off getting out of their cars. What seems entirely predictable and
              controllable on screen has unexpected results when translated into
              reality.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">E</h4>
            <p>
              The same is true in transport engineering, which uses models to
              predict and shape the way people move through the city. Again,
              these models are necessary, but they are built on specific world
              views in which certain forms of efficiency and safety are
              considered and other experience of the city ignored. Designs that
              seem logical in models appear counter-intuitive in the actual
              experience of their users. The guard rails that will be familiar
              to anyone who has attempted to cross a British road, for example,
              were an engineering solution to pedestrian safety based on models
              that prioritise the smooth flow of traffic. On wide major roads,
              they often guide pedestrians to specific crossing points and slow
              down their progress across the road by using staggered access
              points divide the crossing into two – one for each carriageway. In
              doing so they make crossings feel longer, introducing
              psychological barriers greatly impacting those that are the least
              mobile, and encouraging others to make dangerous crossings to get
              around the guard rails. These barriers don't just make it harder
              to cross the road: they divide communities and decrease
              opportunities for healthy transport. As a result, many are now
              being removed, causing disruption, cost, and waste.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">F</h4>
            <p>
              If their designers had had the tools to think with their bodies –
              like dancers – and imagine how these barriers would feel, there
              might have been a better solution. In order to bring about
              fundamental changes to the ways we use our cities, engineering
              will need to develop a richer understanding of why people move in
              certain ways, and how this movement affects them. Choreography may
              not seem an obvious choice for tackling this problem. Yet it
              shares with engineering the aim of designing patterns of movement
              within limitations of space. It is an art form developed almost
              entirely by trying out ideas with the body, and gaining instant
              feedback on how the results feel. Choreographers have deep
              understanding of the psychological, aesthetic, and physical
              implications of different ways of moving.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">G</h4>
            <p>
              Observing the choreographer Wayne McGregor, cognitive scientist
              David Kirsh described how he 'thinks with the body', Kirsh argues
              that by using the body to simulate outcomes, McGregor is able to
              imagine solutions that would not be possible using purely abstract
              thought. This kind of physical knowledge is valued in many areas
              of expertise, but currently has no place in formal engineering
              design processes. A suggested method for transport engineers is to
              improvise design solutions and instant feedback about how they
              would work from their own experience of them, or model designs at
              full scale in the way choreographers experiment with groups of
              dancers. Above all, perhaps, they might learn to design for
              emotional as well as functional effects.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 1-6</h3>
        <p className="text-blue-800 text-sm">
          Reading Passage 1 has seven paragraphs, A-G. Which paragraph contains
          the following information?
        </p>
      </div>

      <div className="space-y-3">
        {[
          {
            q: 1,
            text: "reference to an appealing way of using dance that the writer is not proposing",
          },
          {
            q: 2,
            text: "an example of a contrast between past and present approaches to building",
          },
          {
            q: 3,
            text: "mention of an objective of both dance and engineering",
          },
          {
            q: 4,
            text: "reference to an unforeseen problem arising from ignoring the climate",
          },
          {
            q: 5,
            text: "why some measures intended to help people are being reversed",
          },
          {
            q: 6,
            text: "reference to how transport has an impact on human lives",
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
              placeholder="A-G"
              maxLength={1}
            />
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 7-13</h3>
        <p className="text-blue-800 text-sm">
          Complete the notes below. Choose ONE WORD ONLY from the passage for
          each answer.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold mb-4">Guard rails</h4>
        <div className="space-y-3">
          <p>
            Guard rails were introduced on British roads to improve the{" "}
            <input
              type="text"
              value={answers[7] || ""}
              onChange={(e) => handleAnswerChange(7, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="7"
            />{" "}
            of pedestrians, while ensuring that the movement of{" "}
            <input
              type="text"
              value={answers[8] || ""}
              onChange={(e) => handleAnswerChange(8, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="8"
            />{" "}
            is not disrupted. Pedestrians are led to access points, and
            encouraged to cross one{" "}
            <input
              type="text"
              value={answers[9] || ""}
              onChange={(e) => handleAnswerChange(9, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="9"
            />{" "}
            at a time.
          </p>
          <p>
            An unintended effect is to create psychological difficulties in
            crossing the road, particularly for less{" "}
            <input
              type="text"
              value={answers[10] || ""}
              onChange={(e) => handleAnswerChange(10, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="10"
            />{" "}
            people. Another result is that some people cross the road in a{" "}
            <input
              type="text"
              value={answers[11] || ""}
              onChange={(e) => handleAnswerChange(11, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="11"
            />{" "}
            way. The guard rails separate{" "}
            <input
              type="text"
              value={answers[12] || ""}
              onChange={(e) => handleAnswerChange(12, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="12"
            />
            , and make it more difficult to introduce forms of transport that
            are{" "}
            <input
              type="text"
              value={answers[13] || ""}
              onChange={(e) => handleAnswerChange(13, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="13"
            />
            .
          </p>
        </div>
      </div>
    </div>
  );

  const renderPassage2 = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-2xl font-bold mb-4">
          Should we try to bring extinct species back to life?
        </h3>
        <div className="prose max-w-none space-y-4 text-gray-700">
          <div>
            <h4 className="font-bold mb-2">A</h4>
            <p>
              The passenger pigeon was a legendary species. Flying in vast
              numbers across North America, with potentially many millions
              within a single flock, their migration was once one of nature's
              great spectacles. Sadly, the passenger pigeon's existence came to
              an end on 1 September 1914, when the last living specimen died at
              Cincinnati Zoo. Geneticist Ben Novak is lead researcher on an
              ambitious project which now aims to bring the bird back to life
              through a process known as 'de-extinction'. The basic premise
              involves using cloning technology to turn the DNA of extinct
              animals into a fertilised embryo, which is carried by the nearest
              relative still in existence – in this case, the abundant
              band-tailed pigeon – before being born as a living, breathing
              animal. Passenger pigeons are one of the pioneering species in
              this field, but they are far from the only ones on which this
              cutting-edge technology is being trialled.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">B</h4>
            <p>
              In Australia, the thylacine, more commonly known as the Tasmanian
              tiger, is another extinct creature which genetic scientists are
              striving to bring back to life. 'There is no carnivore now in
              Tasmania that fills the niche which thylacines once occupied,'
              explains Michael Archer of the University of New South Wales. He
              points out that in the decades since the thylacine went extinct,
              there has been a spread in a 'dangerously debilitating' facial
              tumour syndrome which threatens the existence of the Tasmanian
              devils, the island's other notorious resident. Thylacines would
              have prevented this spread because they would have killed
              significant numbers of Tasmanian devils. 'If that contagious
              cancer had popped up previously, it would have burned out in
              whatever region it started. The return of thylacines to Tasmania
              could help to ensure that devils are never again subjected to
              risks of this kind.'
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">C</h4>
            <p>
              If extinct species can be brought back to life, can humanity begin
              to correct the damage it has caused to the natural world over the
              past few millennia? 'The idea of de-extinction is that we can
              reverse this process, bringing species that no longer exist back
              to life,' says Beth Shapiro of University of California Santa
              Cruz's Genomics Institute. 'I don't think that we can do this.
              There is no way to bring back something that is 100 per cent
              identical to a species that went extinct a long time ago.' A more
              practical approach for long-extinct species is to take the DNA of
              existing species as a template, ready for the insertion of strands
              of extinct animal DNA to create something new; a hybrid, based on
              the living species, but which looks and/or acts like the animal
              which died out.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">D</h4>
            <p>
              This complicated process and questionable outcome begs the
              question: what is the actual point of this technology? 'For us,
              the goal has always been replacing the extinct species with a
              suitable replacement,' explains Novak. 'When it comes to breeding,
              band-tailed pigeons scatter and make maybe one or two nests per
              hectare, whereas passenger pigeons were very social and would make
              10,000 or more nests in one hectare.' Since the disappearance of
              this key species, ecosystems in the eastern US have suffered, as
              the lack of disturbance caused by thousands of passenger pigeons
              wrecking trees and branches means there has been minimal need for
              regrowth. This has left forests stagnant and therefore unwelcoming
              to the plants and animals which evolved to help regenerate the
              forest after a disturbance. According to Novak, a hybridized
              band-tailed pigeon, with the added nesting habits of a passenger
              pigeon, could, in theory, re-establish that forest disturbance,
              thereby creating a habitat necessary for a great many other native
              species to thrive.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">E</h4>
            <p>
              Another popular candidate for this technology is the woolly
              mammoth. George Church, professor at Harvard Medical School and
              leader of the Woolly Mammoth Revival Project, has been focusing on
              cold resistance, the main way in which the extinct woolly mammoth
              and its nearest living relative, the Asian elephant, differ. By
              pinpointing which genetic traits made it possible for mammoths to
              survive the icy climate of the tundra, the project's goal is to
              return mammoths, or a mammoth-like species, to the area. 'My
              highest priority would be preserving the endangered Asian
              elephant,' says Church, 'expanding their range to the huge
              ecosystem of the tundra. Necessary adaptations would include
              smaller ears, thicker hair, and extra insulating fat, all for the
              purpose of reducing heat loss in the tundra, and all traits found
              in the now extinct woolly mammoth.' This repopulation of the
              tundra and boreal forests of Eurasia and North America with large
              mammals could also be a useful factor in reducing carbon emissions
              – elephants punch holes through snow and knock down trees, which
              encourages grass growth. This grass growth would reduce
              temperature, and mitigate emissions from melting permafrost.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">F</h4>
            <p>
              While the prospect of bringing extinct animals back to life might
              capture imaginations, it is, of course, far easier to try to save
              an existing species which is merely threatened with extinction.
              'Many of the technologies that people have in mind when they think
              about de-extinction can be used as a form of "genetic rescue",'
              explains Shapiro. She prefers to focus the debate on how this
              emerging technology could be used to fully understand why various
              species went extinct in the first place, and therefore how we
              could use it to make genetic modifications which could prevent
              mass extinctions in the future. 'I would also say there's an
              incredible moral hazard to not do anything at all,' she continues.
              'We know that what we are doing today is not enough, and we have
              to be willing to take some calculated and measured risks.'
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 14-17</h3>
        <p className="text-blue-800 text-sm">
          Reading Passage 2 has six paragraphs, A-F. Which paragraph contains
          the following information?
        </p>
      </div>

      <div className="space-y-3">
        {[
          {
            q: 14,
            text: "a reference to how further disappearance of multiple species could be avoided",
          },
          {
            q: 15,
            text: "explanation of a way of reproducing an extinct animal using the DNA of only that species",
          },
          {
            q: 16,
            text: "reference to a habitat which has suffered following the extinction of a species",
          },
          {
            q: 17,
            text: "mention of the exact point at which a particular species became extinct",
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
        <h3 className="font-semibold text-blue-900 mb-2">Questions 18-22</h3>
        <p className="text-blue-800 text-sm">
          Complete the summary below. Choose NO MORE THAN TWO WORDS from the
          passage for each answer.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold mb-4">The woolly mammoth revival project</h4>
        <div className="space-y-3">
          <p>
            Professor George Church and his team are trying to identify the{" "}
            <input
              type="text"
              value={answers[18] || ""}
              onChange={(e) => handleAnswerChange(18, e.target.value)}
              className="border rounded px-2 py-1 w-48 mx-1"
              placeholder="18"
            />{" "}
            which enabled mammoths to live in the tundra. The findings could
            help preserve the mammoth's close relative, the endangered Asian
            elephant.
          </p>
          <p>
            According to Church, introducing Asian elephants to the tundra would
            involve certain physical adaptations to minimise{" "}
            <input
              type="text"
              value={answers[19] || ""}
              onChange={(e) => handleAnswerChange(19, e.target.value)}
              className="border rounded px-2 py-1 w-48 mx-1"
              placeholder="19"
            />
            . To survive in the tundra, the species would need to have the
            mammoth-like features of thicker hair,{" "}
            <input
              type="text"
              value={answers[20] || ""}
              onChange={(e) => handleAnswerChange(20, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="20"
            />{" "}
            of a reduced size and more{" "}
            <input
              type="text"
              value={answers[21] || ""}
              onChange={(e) => handleAnswerChange(21, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="21"
            />
            .
          </p>
          <p>
            Repopulating the tundra with mammoths or Asian elephant/mammoth
            hybrids would also have an impact on the environment, which could
            help to reduce temperatures and decrease{" "}
            <input
              type="text"
              value={answers[22] || ""}
              onChange={(e) => handleAnswerChange(22, e.target.value)}
              className="border rounded px-2 py-1 w-48 mx-1"
              placeholder="22"
            />
            .
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 23-26</h3>
        <p className="text-blue-800 text-sm">
          Look at the following statements and the list of people below. Match
          each statement with the correct person, A-C.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border mb-4">
        <div className="space-y-2 text-sm">
          <p>
            <strong>A</strong> Ben Novak
          </p>
          <p>
            <strong>B</strong> Michael Archer
          </p>
          <p>
            <strong>C</strong> Beth Shapiro
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {[
          {
            q: 23,
            text: "Reintroducing an extinct species to its original habitat could improve the health of a particular species living there.",
          },
          {
            q: 24,
            text: "It is important to concentrate on the causes of an animal's extinction.",
          },
          {
            q: 25,
            text: "A species brought back from extinction could have an important beneficial impact on the vegetation of its habitat.",
          },
          {
            q: 26,
            text: "Our current efforts at preserving biodiversity are insufficient.",
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
              placeholder="A-C"
              maxLength={1}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderPassage3 = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-2xl font-bold mb-4">Having a laugh</h3>
        <div className="prose max-w-none space-y-4 text-gray-700">
          <p>
            Humans start developing a sense of humour as early as six weeks old,
            when babies begin to laugh and smile in response to stimuli.
            Laughter is universal across all human cultures and even exists in
            some form in rats, chimps, and bonobos. Like other human emotions
            and expressions, laughter and humour psychological scientists with
            rich resources for studying human psychology, ranging from the
            development of language to the neuroscience of social perception.
          </p>
          <p>
            Theories focusing on the evolution of laughter point to it as an
            important adaptation for social communication. Take, for example,
            the recorded laughter in TV comedy shows. Back in 1950, US sound
            engineer Charley Douglass hated dealing with the unpredictable
            laughter of live audiences, so started recording his own 'laugh
            tracks'. These were intended to help people at home feel like they
            were in a social situation, such as a crowded theatre. Douglass even
            recorded various types of laughter, as well as mixtures of laugher
            from men, women, and children. In doing so, he picked up on a
            quality of laughter that is now interesting researchers: a simple
            'haha' communicates a remarkable amount of socially relevant
            information.
          </p>
          <p>
            In one study conducted in 2016, samples of laughter from pairs of
            English-speaking students were recorded at the University of
            California, Santa Cruz. A team made up of more than 30 psychological
            scientists, anthropologists, and biologists then played these
            recording to listeners from 24 diverse societies, from indigenous
            tribes in New Guinea to city-dwellers in India and Europe.
            Participants were asked whether they thought the people laughing
            were friends or strangers. On average, the results were remarkably
            consistent: worldwide, people's guesses were correct approximately
            60% of the time.
          </p>
          <p>
            Researchers have also found that different types of laughter serve
            as codes to complex human social hierarchies. A team led by
            Christopher Oveis from the University of California, San Diego,
            found that high-status individuals had different laughs from
            low-status individuals, and that strangers' judgements of an
            individual's social status were influenced by the dominant or
            submissive quality of their laughter. In their study, 48 male
            college students were randomly assigned to groups of four, with each
            group composed of two low-status members, who had just joined their
            college fraternity group, and two high-status members, older student
            took a turn at being teased by the others, involving the use of
            mildly insulting nicknames. Analysis revealed that, as expected,
            high-status individuals produced more dominant laughs and fewer
            submissive laughs relative to the low-status individuals. Meanwhile,
            low-status individuals were more likely to change their laughter
            based on their position of power; that is, the newcomers produced
            more dominant laughs when they were in the 'powerful' role of
            teasers. Dominant laughter was higher in pitch, louder, and more
            variable in tone than submissive laughter.
          </p>
          <p>
            A random group of volunteers then listened to an equal number of
            dominant and submissive laughs from both the high- and low-status
            individuals, and were asked to estimate the social status of the
            laughter. In line with predictions, laughers producing dominant
            laughs were perceived to be significantly higher in status than
            laughers producing submissive laughs. 'This was particularly true
            for low-status individuals, who were rated as significantly higher
            in status when displaying a dominant versus submissive laugh,' Oveis
            and colleagues note. 'Thus, by strategically displaying more
            dominant laughter when the context allows, low-status individuals
            may achieve higher status in the eyes of others.' However,
            high-status individuals were rated as high-status whether they
            produced their natural dominant laugh or tried to do a submissive
            one.
          </p>
          <p>
            Another study, conducted by David Cheng and Lu Wang of Australian
            National University, was based on the hypothesis that humour might
            provide a respite from tedious situations in the workplace. This
            'mental break' might facilitate the replenishment of mental
            resources. To test this theory, the researchers recruited 74
            business students, ostensibly for an experiment on perception.
            First, the students performed a tedious task in which they had to
            cross out every instance of the letter 'e' over two pages of text.
            The students then were randomly assigned to watch a video clip
            eliciting either humour, contentment, or neutral feelings. Some
            watched a clip of the BBC comedy Mr. Bean, others a relaxing scene
            with dolphins swimming in the ocean, and others a factual video
            about the management profession.
          </p>
          <p>
            The students then completed a task requiring persistence in which
            they were asked to guess the potential performance of employees
            based on provided profiles, and were told that making 10 correct
            assessments in a row would lead to a win. However, the software was
            programmed such that is was nearly impossible to achieve 10
            consecutive correct answers. Participants were allowed to quit the
            task at any point. Students who had watched the Mr. Bean video ended
            up spending significantly more time working on the task, making
            twice as many predictions as the other two groups.
          </p>
          <p>
            Cheng and Wang then replicated these results in a second study,
            during which they had participants complete long multiplication
            questions by hand. Again, participants who watched the humorous
            video spent significantly more time working on this tedious task and
            completed more questions correctly than did the students in either
            of the other groups.
          </p>
          <p>
            'Although humour has been found to help relieve stress and
            facilitate social relationships, traditional view of task
            performance implies that individuals should avoid things such as
            humour that may distract them from the accomplishment of task
            goals,' Cheng and Wang conclude. 'We suggest that humour is not only
            enjoyable but more importantly, energising.'
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 27-31</h3>
        <p className="text-blue-800 text-sm">
          Choose the correct letter, A, B, C or D.
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            q: 27,
            text: "When referring to laughter in the first paragraph, the writer emphasises",
            options: [
              "its impact on language development.",
              "the differences between humans and primates.",
              "its value to scientific research.",
              "the importance of social interaction.",
            ],
          },
          {
            q: 28,
            text: "What does the writer suggest about Charley Douglass?",
            options: [
              "He understood the importance of enjoying humour in a group setting.",
              "He was the first person to record laughter for entertainment purposes.",
              "His work helped researchers understand social hierarchies.",
              "His recordings were more realistic than genuine laughter.",
            ],
          },
          {
            q: 29,
            text: "What makes the Santa Cruz study particularly significant?",
            options: [
              "the different kinds of laughter that were recorded",
              "the similar results produced by a wide range of cultures",
              "the number of people who took part in the experiment",
              "the age range of the participants involved",
            ],
          },
          {
            q: 30,
            text: "Which of the following happened in the San Diego study?",
            options: [
              "Participants described the type of laughter they produced.",
              "Participants exchanged roles.",
              "Participants were asked to identify the status of others.",
              "Participants were given insulting nicknames to respond to.",
            ],
          },
          {
            q: 31,
            text: "In the fifth paragraph, what did the results of the San Diego study suggest?",
            options: [
              "Low-status individuals learnt to laugh like high-status ones.",
              "The dominant laugh of low-status individuals was not convincing.",
              "The submissive laughs of high-status individuals were unconvincing.",
              "High-status individuals can always be identified by their way of laughing.",
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
        <h3 className="font-semibold text-blue-900 mb-2">Questions 32-36</h3>
        <p className="text-blue-800 text-sm">
          Complete the summary using the list of words, A-H, below. Write the
          correct letter, A-H.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border mb-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>
            <strong>A</strong> laughter
          </p>
          <p>
            <strong>B</strong> relaxing
          </p>
          <p>
            <strong>C</strong> boring
          </p>
          <p>
            <strong>D</strong> anxiety
          </p>
          <p>
            <strong>E</strong> stimulating
          </p>
          <p>
            <strong>F</strong> emotion
          </p>
          <p>
            <strong>G</strong> enjoyment
          </p>
          <p>
            <strong>H</strong> amusing
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold mb-4">The benefits of humour</h4>
        <div className="space-y-3">
          <p>
            In one study at Australian National University, randomly chosen
            groups of participants were shown one of three videos, each designed
            to generate a different kind of{" "}
            <input
              type="text"
              value={answers[32] || ""}
              onChange={(e) =>
                handleAnswerChange(32, e.target.value.toUpperCase())
              }
              className="border rounded px-2 py-1 w-20 mx-1"
              placeholder="32"
              maxLength={1}
            />
            . When all participants were then given a deliberately frustrating
            task to do, it was found that those who had watched the{" "}
            <input
              type="text"
              value={answers[33] || ""}
              onChange={(e) =>
                handleAnswerChange(33, e.target.value.toUpperCase())
              }
              className="border rounded px-2 py-1 w-20 mx-1"
              placeholder="33"
              maxLength={1}
            />{" "}
            video persisted with the task for longer and tried harder to
            accomplish the task than either of the other two groups.
          </p>
          <p>
            A second study in which participants were asked to perform a
            particularly{" "}
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
            task produced similar results. According to researchers David Cheng
            and Lu Wang, these findings suggest that humour not only reduces{" "}
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
            and helps build social connections but it may also have a{" "}
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
            effect on the body and mind.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 37-40</h3>
        <p className="text-blue-800 text-sm">
          Do the following statements agree with the information given in
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
            q: 37,
            text: "Participants in the Santa Cruz study were more accurate at identifying the laughs of friends than those of strangers.",
          },
          {
            q: 38,
            text: "The researchers in the San Diego study were correct in their predictions regarding the behaviour of the high-status individuals.",
          },
          {
            q: 39,
            text: "The participants in the Australian National University study were given a fixed amount of time to complete the task focusing on employee profiles.",
          },
          {
            q: 40,
            text: "Cheng and Wang's conclusions were in line with established notions regarding task performance.",
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
            IELTS Reading Test 2 - Passage {currentPassage}
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

export default ReadingTest2;