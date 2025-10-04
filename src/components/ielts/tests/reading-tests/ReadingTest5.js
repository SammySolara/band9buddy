import { useState, useRef, useEffect } from "react";
import {
  Clock,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";

const TOTAL_TIME = 3600;

const ReadingTest5 = ({ onComplete, onExit }) => {
  const [currentPassage, setCurrentPassage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const timerRef = useRef(null);

  const answerKey = {
    1: "potatoes",
    2: "butter",
    3: "meat",
    4: "crystals",
    5: "cellophane",
    6: "tin",
    7: "refrigerator",
    8: "NOT GIVEN",
    9: "TRUE",
    10: "FALSE",
    11: "TRUE",
    12: "FALSE",
    13: "NOT GIVEN",
    14: "v",
    15: "ii",
    16: "iv",
    17: "vii",
    18: "iii",
    19: "vi",
    20: "C",
    21: "E",
    22: "B",
    23: "D",
    24: "tentacles",
    25: "protection",
    26: "colour",
    27: "A",
    28: "C",
    29: "B",
    30: "A",
    31: "B",
    32: "A",
    33: "C",
    34: "C",
    35: "B",
    36: "D",
    37: "B",
    38: "C",
    39: "B",
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

    if (onComplete) onComplete(resultDetails);
  };

  const renderPassage1 = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-2xl font-bold mb-4">Frozen Food</h3>
        <h4 className="text-lg italic mb-4">
          A US perspective on the development of the frozen food industry
        </h4>
        <div className="prose max-w-none space-y-4 text-gray-700">
          <p>
            At some point in history, humans discovered that ice preserved food.
            There is evidence that winter ice was stored to preserve food in the
            summer as far back as 10,000 years ago. Two thousand years ago, the
            inhabitants of South America's Andean mountains had a unique means
            of conserving potatoes for later consumption. They froze them
            overnight, then trampled them to squeeze out the moisture, then
            dried them in the sun. This preserved their nutritional value-if not
            their aesthetic appeal.
          </p>
          <p>
            Natural ice remained the main form of refrigeration until late in
            the 19th century. In the early 1800s, ship owners from Boston, USA,
            had enormous blocks of Arctic ice towed all over the Atlantic for
            the purpose of food preservation. In 1851, railroads first began
            putting blocks of ice in insulated rail cars to send butter from
            Ogdensburg, New York, to Boston.
          </p>
          <p>
            Finally, in 1870, Australian inventors found a way to make
            'mechanical ice'. They used a compressor to force a gas-ammonia at
            first and later Freon-through a condenser. The compressed gas gave
            up some of its heat as it moved through the condenser. Then the gas
            was released quickly into a low-pressure evaporator coil where it
            became liquid and cold. Air was blown over the evaporator coil and
            then this cooled air passed into an insulated compartment, lowering
            its temperature to freezing point.
          </p>
          <p>
            Initially, this process was invented to keep Australian beer cool
            even in hot weather. But Australian cattlemen were quick to realize
            that, if they could put this new invention on a ship, they could
            export meat across the oceans. In 1880, a shipment of Australian
            beef and mutton was sent, frozen, to England. While the food frozen
            this way was still palatable, there was some deterioration. During
            the freezing process, crystals formed within the cells of the food,
            and when the ice expanded and the cells burst, this spoilt the
            flavor and texture of the food.
          </p>
          <p>
            The modern frozen food industry began with the indigenous Inuit
            people of Canada. In 1912, a biology student in Massachusetts, USA,
            named Clarence Birdseye, ran out of money and went to Labrador in
            Canada to trap and trade furs. While he was there, he became
            fascinated with how the Inuit would quickly freeze fish in the
            Arctic air. The fish looked and tasted fresh even months later.
          </p>
          <p>
            Birdseye returned to the USA in 1917 and began developing mechanical
            freezers capable of quick-freezing food. Birdseye methodically kept
            inventing better freezers and gradually built a business selling
            frozen fish from Gloucester, Massachusetts. In 1929, his business
            was sold and became General Foods, but he stayed with the company as
            director of research, and his division continued to innovate.
          </p>
          <p>
            Birdseye was responsible for several key innovations that made the
            frozen food industry possible. He developed quick-freezing
            techniques that reduced the damage that crystals caused, as well as
            the technique of freezing the product in the package it was to be
            sold in. He also introduced the use of cellophane, the first
            transparent material for food packaging, which allowed consumers to
            see the quality of the product. Birdseye products also came in
            convenient size packages that could be prepared with a minimum of
            effort.
          </p>
          <p>
            But there were still obstacles. In the 1930s, few grocery stores
            could afford to buy freezers for a market that wasn't established
            yet. So, Birdseye leased inexpensive freezer cases to them. He also
            leased insulated railroad cars so that he could ship his products
            nationwide. However, few consumers had freezers large enough or
            efficient enough to take advantage of the products.
          </p>
          <p>
            Sales increased in the early 1940s, when World War II gave a boost
            to the frozen food industry because tin was being used for
            munitions. Canned foods were rationed to save tin for the war
            effort, while frozen foods were abundant and cheap. Finally, by the
            1950s, refrigerator technology had developed far enough to make
            these appliances affordable for the average family. By 1953, 33
            million US families owned a refrigerator, and manufacturers were
            gradually increasing the size of the freezer compartments in them.
          </p>
          <p>
            1950s families were also looking for convenience at mealtimes, so
            the moment was right for the arrival of the 'TV Dinner'. Swanson
            Foods was a large, nationally recognized producer of canned and
            frozen poultry. In 1954, the company adapted some of Birdseye's
            freezing techniques, and with the help of a clever name and a huge
            advertising budget, it launched the first 'TV Dinner'. This
            consisted of frozen turkey, potatoes and vegetables served in the
            same segmented aluminum tray that was used by airlines. The product
            was an instant success. Within a year, Swanson had sold 13 million
            TV dinners. American consumers couldn't resist the combination of a
            trusted brand name, a single-serving package and the convenience of
            a meal that could be ready after only 25 minutes in a hot oven. By
            1959, Americans were spending $2.7 billion annually on frozen foods,
            and half a billion of that was spent on ready-prepared meals such as
            the TV Dinner.
          </p>
          <p>
            Today, the US frozen food industry has a turnover of over $67
            billion annually, with $26.6 billion of that sold to consumers for
            home consumption. The remaining $40 billion in frozen food sales
            come through restaurants, cafeterias, hospitals and schools, and
            that represents a third of the total food service sales.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 1-7</h3>
        <p className="text-blue-800 text-sm">
          Complete the notes below. Choose ONE WORD ONLY from the passage for
          each answer.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold mb-4">The history of frozen food</h4>
        <div className="space-y-4">
          <div>
            <h5 className="font-semibold mb-2">
              2,000 years ago, South America
            </h5>
            <p>
              • People conserved the nutritional value of{" "}
              <input
                type="text"
                value={answers[1] || ""}
                onChange={(e) => handleAnswerChange(1, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="1"
              />
              , using a method of freezing then drying.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">1851, USA</h5>
            <p>
              •{" "}
              <input
                type="text"
                value={answers[2] || ""}
                onChange={(e) => handleAnswerChange(2, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="2"
              />{" "}
              was kept cool by ice during transportation in specially adapted
              trains.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">1880, Australia</h5>
            <p>
              • Two kinds of{" "}
              <input
                type="text"
                value={answers[3] || ""}
                onChange={(e) => handleAnswerChange(3, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="3"
              />{" "}
              were the first frozen food shipped to England.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">1917 onwards, USA</h5>
            <p>• Clarence Birdseye introduced innovations including:</p>
            <p className="ml-4">
              ○ quick-freezing methods, so that{" "}
              <input
                type="text"
                value={answers[4] || ""}
                onChange={(e) => handleAnswerChange(4, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="4"
              />{" "}
              did not spoil the food.
            </p>
            <p className="ml-4">
              ○ packaging products with{" "}
              <input
                type="text"
                value={answers[5] || ""}
                onChange={(e) => handleAnswerChange(5, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="5"
              />{" "}
              so the product was visible.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Early 1940s, USA</h5>
            <p>
              • Frozen food became popular because of a shortage of{" "}
              <input
                type="text"
                value={answers[6] || ""}
                onChange={(e) => handleAnswerChange(6, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="6"
              />
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">1950s, USA</h5>
            <p>
              • A large number of homes now had a{" "}
              <input
                type="text"
                value={answers[7] || ""}
                onChange={(e) => handleAnswerChange(7, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="7"
              />
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 8-13</h3>
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
            q: 8,
            text: "The ice transportation business made some Boston ship owners very wealthy in the early 1800s.",
          },
          {
            q: 9,
            text: "A disadvantage of the freezing process invented in Australia was that it affected the taste of food.",
          },
          {
            q: 10,
            text: "Clarence Birdseye travelled to Labrador in order to learn how the Inuit people froze fish.",
          },
          {
            q: 11,
            text: "Swanson Foods invested a great deal of money in the promotion of the TV Dinner.",
          },
          {
            q: 12,
            text: "Swanson Foods developed a new style of container for the launch of the TV Dinner.",
          },
          {
            q: 13,
            text: "The US frozen food industry is currently the largest in the world.",
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
        <h3 className="text-2xl font-bold mb-4">
          Can the planet's coral reefs be saved?
        </h3>
        <div className="prose max-w-none space-y-4 text-gray-700">
          <div>
            <h4 className="font-bold mb-2">A</h4>
            <p>
              Conservationists have put the final touches to a giant artificial
              reef they have been assembling at the world-renowned Zoological
              Society of London (London Zoo). Samples of the planet's most
              spectacular corals – vivid green branching coral, yellow scroll,
              blue ridge and many more species – have been added to the giant
              tank along with fish that thrive in their presence: blue tang,
              clownfish and many others. The reef is in the zoo's new gallery,
              Tiny Giants, which is dedicated to the minuscule invertebrate
              creatures that sustain life across the planet. The coral reef tank
              and its seven-metre-wide window form the core of the exhibition.
            </p>
            <p>
              'Coral reefs are the most diverse ecosystems on Earth and we want
              to show people how wonderful they are,' said Paul Pearce-Kelly,
              senior curator of invertebrates and fish at the Zoological Society
              of London. 'However, we also want to highlight the research and
              conservation efforts that are now being carried out to try to save
              them from the threat of global warming.' They want people to see
              what is being done to try to save these wonders.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">B</h4>
            <p>
              Corals are composed of tiny animals, known as polyps, with
              tentacles for capturing small marine creatures in the sea water.
              These polyps are transparent but get their brilliant tones of
              pink, orange, blue, green, etc. from algae that live within them,
              which in turn get protection, while their photosynthesising of the
              sun's rays provides nutrients for the polyps. This comfortable
              symbiotic relationship has led to the growth of coral reefs that
              cover 0.1% of the planet's ocean bed while providing homes for
              more than 25% of marine species, including fish, molluscs, sponges
              and shellfish.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">C</h4>
            <p>
              As a result, coral reefs are often described as the 'rainforests
              of the sea', though the comparison is dismissed by some
              naturalists, including David Attenborough. 'People say you cannot
              beat the rainforest,' Attenborough has stated. 'But that is simply
              not true. You go there and the first thing you think is: where are
              the birds? Where are the animals? They are hiding in the trees, of
              course. No, if you want beauty and wildlife, you want a coral
              reef. Put on a mask and stick your head under the water. The sight
              is mind-blowing.'
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">D</h4>
            <p>
              Unfortunately, these majestic sights are now under very serious
              threat, with the most immediate problem coming in the form of
              thermal stress. Rising ocean temperatures are triggering bleaching
              events that strip reefs of their colour and eventually kill them.
              And that is just the start. Other menaces include ocean
              acidification, sea level increase, pollution by humans,
              deoxygenation and ocean current changes, while the climate crisis
              is also increasing habitat destruction. As a result, vast areas –
              including massive chunks of Australia's Great Barrier Reef – have
              already been destroyed, and scientists advise that more than 90%
              of reefs could be lost by 2050 unless urgent action is taken to
              tackle global heating and greenhouse gas emissions.
            </p>
            <p>
              Pearce-Kelly says that coral reefs have to survive really harsh
              conditions – wave erosion and other factors. And 'when things
              start to go wrong in the oceans, then corals will be the first to
              react. And that is exactly what we are seeing now. Coral reefs are
              dying and they are telling us that all is not well with our
              planet.'
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">E</h4>
            <p>
              However, scientists are trying to pinpoint hardy types of coral
              that could survive our overheated oceans, and some of this
              research will be carried out at London Zoo. 'Behind our … coral
              reef tank we have built laboratories where scientists will be
              studying coral species,' said Pearce-Kelly. One aim will be to
              carry out research on species to find those that can survive best
              in warm, acidic waters. Another will be to try to increase coral
              breeding rates. 'Coral spawn just once a year,' he added.
              'However, aquarium-based research has enabled some corals to spawn
              artificially, which can assist coral reef restoration efforts. And
              if this can be extended for all species, we could consider the
              launching of coral-spawning programmes several times a year. That
              would be a big help in restoring blighted reefs.'
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">F</h4>
            <p>
              Research in these fields is being conducted in laboratories around
              the world, with the London Zoo centre linked to this global
              network. Studies carried out in one centre can then be tested in
              others. The resulting young coral can then be displayed in the
              tank in Tiny Giants. 'The crucial point is that the progress we
              make in making coral better able to survive in a warming world can
              be shown to the public and encourage them to believe that we can
              do something to save the planet's reefs,' said Pearce-Kelly.
              'Saving our coral reefs is now a critically important ecological
              goal.'
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 14-19</h3>
        <p className="text-blue-800 text-sm">
          Reading Passage 2 has six sections, A–F. Choose the correct heading
          for each section from the list of headings below.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border mb-4">
        <div className="space-y-2 text-sm">
          <p>
            <strong>i</strong> Tried and tested solutions
          </p>
          <p>
            <strong>ii</strong> Cooperation beneath the waves
          </p>
          <p>
            <strong>iii</strong> Working to lessen the problems
          </p>
          <p>
            <strong>iv</strong> Disagreement about the accuracy of a certain
            phrase
          </p>
          <p>
            <strong>v</strong> Two clear educational goals
          </p>
          <p>
            <strong>vi</strong> Promoting hope
          </p>
          <p>
            <strong>vii</strong> A warning of further trouble ahead
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { q: 14, text: "Section A" },
          { q: 15, text: "Section B" },
          { q: 16, text: "Section C" },
          { q: 17, text: "Section D" },
          { q: 18, text: "Section E" },
          { q: 19, text: "Section F" },
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
              onChange={(e) => handleAnswerChange(q, e.target.value)}
              className="border rounded px-2 py-1 w-20"
              placeholder="i-vii"
            />
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          Questions 20 and 21
        </h3>
        <p className="text-blue-800 text-sm">
          Choose TWO letters, A–E. Which TWO of these causes of damage to coral
          reefs are mentioned by the writer of the text?
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border mb-4">
        <div className="space-y-2 text-sm">
          <p>
            <strong>A</strong> a rising number of extreme storms
          </p>
          <p>
            <strong>B</strong> the removal of too many fish from the sea
          </p>
          <p>
            <strong>C</strong> the contamination of the sea from waste
          </p>
          <p>
            <strong>D</strong> increased disease among marine species
          </p>
          <p>
            <strong>E</strong> alterations in the usual flow of water in the
            seas
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {[20, 21].map((q) => (
          <div
            key={q}
            className="bg-white p-4 rounded-lg border flex items-center gap-4"
          >
            <span className="font-semibold">Question {q}</span>
            <input
              type="text"
              value={answers[q] || ""}
              onChange={(e) =>
                handleAnswerChange(q, e.target.value.toUpperCase())
              }
              className="border rounded px-2 py-1 w-20"
              placeholder="A-E"
              maxLength={1}
            />
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          Questions 22 and 23
        </h3>
        <p className="text-blue-800 text-sm">
          Choose TWO letters, A–E. Which TWO of the following statements are
          true of the researchers at London Zoo?
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border mb-4">
        <div className="space-y-2 text-sm">
          <p>
            <strong>A</strong> They are hoping to expand the numbers of
            different corals being bred in laboratories.
          </p>
          <p>
            <strong>B</strong> They want to identify corals that can cope well
            with the changed sea conditions.
          </p>
          <p>
            <strong>C</strong> They are looking at ways of creating artificial
            reefs that corals could grow on.
          </p>
          <p>
            <strong>D</strong> They are trying out methods that would speed up
            reproduction in some corals.
          </p>
          <p>
            <strong>E</strong> They are investigating materials that might
            protect reefs from higher temperatures.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {[22, 23].map((q) => (
          <div
            key={q}
            className="bg-white p-4 rounded-lg border flex items-center gap-4"
          >
            <span className="font-semibold">Question {q}</span>
            <input
              type="text"
              value={answers[q] || ""}
              onChange={(e) =>
                handleAnswerChange(q, e.target.value.toUpperCase())
              }
              className="border rounded px-2 py-1 w-20"
              placeholder="A-E"
              maxLength={1}
            />
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 24-26</h3>
        <p className="text-blue-800 text-sm">
          Complete the sentences below. Choose ONE WORD ONLY from the passage
          for each answer.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg border">
          <p>
            <strong>24.</strong> Corals have a number of{" "}
            <input
              type="text"
              value={answers[24] || ""}
              onChange={(e) => handleAnswerChange(24, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="24"
            />{" "}
            which they use to collect their food.
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p>
            <strong>25.</strong> Algae gain{" "}
            <input
              type="text"
              value={answers[25] || ""}
              onChange={(e) => handleAnswerChange(25, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="25"
            />{" "}
            from being inside the coral.
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p>
            <strong>26.</strong> Increases in the warmth of the sea water can
            remove the{" "}
            <input
              type="text"
              value={answers[26] || ""}
              onChange={(e) => handleAnswerChange(26, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="26"
            />{" "}
            from coral.
          </p>
        </div>
      </div>
    </div>
  );

  const renderPassage3 = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-2xl font-bold mb-4">Robots and us</h3>
        <h4 className="text-lg italic mb-4">
          Three leaders in their fields answer questions about our relationships
          with robots
        </h4>
        <div className="prose max-w-none space-y-4 text-gray-700">
          <p>
            When asked 'Should robots be used to colonise other planets?',
            cosmology and astrophysics Professor Martin Rees said he believed
            the solar system would be mapped by robotic craft by the end of the
            century. 'The next step would be mining of asteroids, enabling
            fabrication of large structures in space without having to bring all
            the raw materials from Earth…. I think this is more realistic and
            benign than the … "terraforming" of planets.' He maintains that
            colonised planets 'should be preserved with a status that is
            analogous to Antarctica here on Earth.'
          </p>
          <p>
            On the question of using robots to colonise other planets and
            exploit mineral resources, engineering Professor Daniel Wolpert
            replied, 'I don't see a pressing need to colonise other planets
            unless we can bring [these] resources back to Earth. The vast
            majority of Earth is currently inaccessible to us. Using robots to
            gather resources nearer to home would seem to be a better use of our
            robotic tools.'
          </p>
          <p>
            Meanwhile, for anthropology Professor Kathleen Richardson, the idea
            of 'colonisation' of other planets seemed morally dubious: 'I think
            whether we do something on Earth or on Mars we should always do it
            in the spirit of a genuine interest in "the Other", not to impose a
            particular model, but to meet "the Other".'
          </p>
          <p>
            In response to the second question, 'How soon will machine
            intelligence outstrip human intelligence?', Rees mentions robots
            that are advanced enough to beat humans at chess, but then goes on
            to say, 'Robots are still limited in their ability to sense their
            environment: they can't yet recognise and move the pieces on a real
            chessboard as cleverly as a child can. Later this century, however,
            their more advanced successors may relate to their surroundings, and
            to people, as adeptly as we do. Moral questions then arise. … Should
            we feel guilty about exploiting [sophisticated robots]? Should we
            fret if they are underemployed, frustrated, or bored?'
          </p>
          <p>
            Wolpert's response to the question about machine intelligence
            outstripping human intelligence was this: 'In a limited sense it
            already has. Machines can already navigate, remember and search for
            items with an ability that far outstrips humans. However, there is
            no machine that can identify visual objects or speech with the
            reliability and flexibility of humans…. Expecting a machine close to
            the creative intelligence of a human within the next 50 years would
            be highly ambitious.'
          </p>
          <p>
            Richardson believes that our fear of machines becoming too advanced
            has more to do with human nature than anything intrinsic to the
            machines themselves. In her view, it stems from humans' tendency to
            personify inanimate objects: we create machines based on
            representations of ourselves, imagine that machines think and behave
            as we do, and therefore see them as an autonomous threat. 'One of
            the consequences of thinking that the problem lies with machines is
            that we tend to imagine they are greater and more powerful than they
            really are and subsequently they become so.'
          </p>
          <p>
            This led on to the third question, 'Should we be scared by advances
            in artificial intelligence?' To this question, Rees replied, 'Those
            who should be worried are the futurologists who believe in the
            so-called "singularity". … And another worry is that we are
            increasingly dependent on computer networks, and that these could
            behave like a single "brain" with a mind of its own, and with goals
            that may be contrary to human welfare. I think we should ensure that
            robots remain as no more than "idiot savants" lacking the capacity
            to outwit us, even though they may greatly surpass us in the ability
            to calculate and process information.'
          </p>
          <p>
            Wolpert's response was to say that we have already seen the damaging
            effects of artificial intelligence in the form of computer viruses.
            'But in this case,' he says, 'the real intelligence is the malicious
            designer. Critically, the benefits of computers outweigh the damage
            that computer viruses cause. Similarly, while there may be misuses
            of robotics in the near future, the benefits that they will bring
            are likely to outweigh these negative aspects.'
          </p>
          <p>
            Richardson's response to this question was this: 'We need to ask why
            fears of artificial intelligence and robots persist; none have in
            fact risen up and challenged human supremacy.' She believes that as
            robots have never shown themselves to be a threat to humans, it
            seems unlikely that they ever will. In fact, she went on, 'Not all
            fear [robots]; many people welcome machine intelligence.'
          </p>
          <p>
            In answer to the fourth question, 'What can science fiction tell us
            about robotics?', Rees replied, 'I sometimes advise students that
            it's better to read first-rate science fiction than second-rate
            science – more stimulating, and perhaps no more likely to be wrong.'
          </p>
          <p>
            As his response, Wolpert commented, 'Science fiction has often been
            remarkable at predicting the future. Science fiction has painted a
            vivid spectrum of possible futures, from cute and helpful robots to
            dystopian robotic societies. Interestingly, almost no science
            fiction envisages a future without robots.'
          </p>
          <p>
            Finally, on the question of science fiction, Richardson pointed out
            that in modern society, people tend to think there is reality on the
            one hand, and fiction and fantasy on the other. She then explained
            that the division did not always exist, and that scientists and
            technologists made this separation because they wanted to carve out
            the sphere of their work. 'But the divide is not so clear cut, and
            that is why the worlds seem to collide at times,' she said. 'In some
            cases, we need to bring these different understandings together to
            get a whole perspective. Perhaps then, we won't be so frightened
            that something we create as a copy of ourselves will be a [threat]
            to us.'
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 27-33</h3>
        <p className="text-blue-800 text-sm">
          Look at the following statements and the list of experts below. Match
          each statement with the correct expert, A, B or C.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border mb-4">
        <div className="space-y-2 text-sm">
          <p>
            <strong>A</strong> Martin Rees
          </p>
          <p>
            <strong>B</strong> Daniel Wolpert
          </p>
          <p>
            <strong>C</strong> Kathleen Richardson
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {[
          {
            q: 27,
            text: "For our own safety, humans will need to restrict the abilities of robots.",
          },
          {
            q: 28,
            text: "The risk of robots harming us is less serious than humans believe it to be.",
          },
          {
            q: 29,
            text: "It will take many decades for robot intelligence to be as imaginative as human intelligence.",
          },
          {
            q: 30,
            text: "We may have to start considering whether we are treating robots fairly.",
          },
          {
            q: 31,
            text: "Robots are probably of more help to us on Earth than in space.",
          },
          {
            q: 32,
            text: "The ideas in high-quality science fiction may prove to be just as accurate as those found in the work of mediocre scientists.",
          },
          {
            q: 33,
            text: "There are those who look forward to robots developing greater intelligence.",
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

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 34-36</h3>
        <p className="text-blue-800 text-sm">
          Complete each sentence with the correct ending, A–D, below.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border mb-4">
        <div className="space-y-2 text-sm">
          <p>
            <strong>A</strong> robots to explore outer space.
          </p>
          <p>
            <strong>B</strong> advances made in machine intelligence so far.
          </p>
          <p>
            <strong>C</strong> changes made to other planets for our own
            benefit.
          </p>
          <p>
            <strong>D</strong> the harm already done by artificial intelligence.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {[
          {
            q: 34,
            text: "Richardson and Rees express similar views regarding the ethical aspect of",
          },
          {
            q: 35,
            text: "Rees and Wolpert share an opinion about the extent of",
          },
          {
            q: 36,
            text: "Wolpert disagrees with Richardson on the question of",
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
              placeholder="A-D"
              maxLength={1}
            />
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 37-40</h3>
        <p className="text-blue-800 text-sm">
          Choose the correct letter, A, B, C or D.
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            q: 37,
            text: "What point does Richardson make about fear of machines?",
            options: [
              "It has grown alongside the development of ever more advanced robots.",
              "It is the result of our inclination to attribute human characteristics to non-human entities.",
              "It has its origins in basic misunderstandings about how inanimate objects function.",
              "It demonstrates a key difference between human intelligence and machine intelligence.",
            ],
          },
          {
            q: 38,
            text: "What potential advance does Rees see as a cause for concern?",
            options: [
              "robots outnumbering people",
              "robots having abilities which humans do not",
              "artificial intelligence developing independent thought",
              "artificial intelligence taking over every aspect of our lives",
            ],
          },
          {
            q: 39,
            text: "What does Wolpert emphasise in his response to the question about science fiction?",
            options: [
              "how science fiction influences our attitudes to robots",
              "how fundamental robots are to the science fiction genre",
              "how the image of robots in science fiction has changed over time",
              "how reactions to similar portrayals of robots in science fiction may vary",
            ],
          },
          {
            q: 40,
            text: "What is Richardson doing in her comment about reality and fantasy?",
            options: [
              "warning people not to confuse one with the other",
              "outlining ways in which one has impacted on the other",
              "recommending a change of approach in how people view them",
              "explaining why scientists have a different perspective on them from other people",
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
            IELTS Reading Test 5 - Passage {currentPassage}
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

export default ReadingTest5;
