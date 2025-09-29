import { useState, useRef, useEffect } from "react";
import {
  Clock,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";

const TOTAL_TIME = 3600; // 60 minutes in seconds

const ReadingTest1 = ({ onComplete, onExit }) => {
  const [currentPassage, setCurrentPassage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const timerRef = useRef(null);

  // ANSWER KEY - You'll fill this in
  const answerKey = {
    1: "", // oval
    2: "", // husk
    3: "", // seed
    4: "", // mace
    5: "", // FALSE
    6: "", // NOT GIVEN
    7: "", // TRUE
    8: "", // Arabs
    9: "", // plague
    10: "", // lime
    11: "", // Run
    12: "", // Mauritius
    13: "", // tsunami/volcanic
    14: "", // C
    15: "", // B
    16: "", // E
    17: "", // G
    18: "", // D
    19: "", // human error
    20: "", // car-sharing
    21: "", // ownership
    22: "", // mileage
    23: "", // C
    24: "", // D
    25: "", // A
    26: "", // E
    27: "", // A
    28: "", // C
    29: "", // C
    30: "", // D
    31: "", // A
    32: "", // B
    33: "", // E
    34: "", // A
    35: "", // D
    36: "", // E
    37: "", // B
    38: "", // expeditions
    39: "", // uncontacted tribes
    40: "", // land surface
  };

  // Timer effect
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(timerRef.current);
      handleSubmit();
    }
  }, [timeLeft]);

  // Scroll to top when passage changes
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

  const handleSubmit = () => {
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
        <h3 className="text-2xl font-bold mb-4">Nutmeg – a valuable spice</h3>
        <div className="prose max-w-none space-y-4 text-gray-700">
          <p>
            The nutmeg tree, Myristica fragrans, is a large evergreen tree
            native to Southeast Asia. Until the late 18th century, it only grew
            in one place in the world: a small group of islands in the Banda
            Sea, part of the Moluccas – or Spice Islands – in northeastern
            Indonesia. The tree is thickly branched with dense foliage of tough,
            dark green oval leaves, and produces small, yellow, bell-shaped
            flowers and pale yellow pear-shaped fruits. The fruit is encased in
            a flesh husk. When the fruit is ripe, this husk splits into two
            halves along a ridge running the length of the fruit. Inside is a
            purple-brown shiny seed, 2-3 cm long by about 2 cm across,
            surrounded by a lacy red or crimson covering called an 'aril'. These
            are the sources of the two spices nutmeg and mace, the former being
            produced from the dried seed and the latter from the aril.
          </p>
          <p>
            Nutmeg was a highly prized and costly ingredient in European cuisine
            in the Middle Ages, and was used as a flavouring, medicinal, and
            preservative agent. Throughout this period, the Arabs were the
            exclusive importers of the spice to Europe. They sold nutmeg for
            high prices to merchants based in Venice, but they never revealed
            the exact location of the source of this extremely valuable
            commodity. The Arab-Venetian dominance of the trade finally ended in
            1512, when the Portuguese reached the Banda Islands and began
            exploiting its precious resources.
          </p>
          <p>
            Always in danger of competition from neighbouring Spain, the
            Portuguese began subcontracting their spice distribution to Dutch
            traders. Profits began to flow into the Netherlands, and the Dutch
            commercial fleet swiftly grew into one of the largest in the world.
            The Dutch quietly gained control of most of the shipping and trading
            of spices in Northern Europe. Then, in 1580, Portugal fell under
            Spanish rule, and by the end of the 16th century the Dutch found
            themselves locked out of the market. As prices for pepper, nutmeg,
            and other spices soared across Europe, they decided to fight back.
          </p>
          <p>
            In 1602, Dutch merchants founded the VOC, a trading corporation
            better known as the Dutch East India Company. By 1617, the VOC was
            the richest commercial operation in the world. The company had
            50,000 employees worldwide, with a private army of 30,000 men and a
            fleet of 200 ships. At the same time, thousands of people across
            Europe were dying of the plague, a highly contagious and deadly
            disease. Doctors were desperate for a way to stop the spread of this
            disease, and they decided nutmeg held the cure. Everybody wanted
            nutmeg, and many were willing to spare no expense to have it. Nutmeg
            bought for a few pennies in Indonesia could be sold for 68,000 times
            its original cost on the streets of London. The only problem was the
            short supply. And that's where the Dutch found their opportunity.
          </p>
          <p>
            The Banda Islands were ruled by local sultans who insisted on
            maintaining a neutral trading policy towards foreign powers. This
            allowed them to avoid the presence of Portuguese or Spanish troops
            on their soil, but it also left them unprotected from other
            invaders. In 1621, the Dutch arrived and took over. Once securely in
            control of the Bandas, the Dutch went to work protecting their new
            investment. They concentrated all nutmeg production into a few
            easily guarded areas, uprooting and destroying any trees outside the
            plantation zones. Anyone caught growing a nutmeg seedling or
            carrying seeds without the proper authority was severely punished.
            In addition, all exported nutmeg was covered with lime to make sure
            there was no chance a fertile seed which could be grown elsewhere
            would leave the islands. There was only one obstacle to Dutch
            domination. One of the Banda Islands, a sliver of land called Run,
            only 3 km long by less than 1 km wide, was under the control of the
            British. After decades of fighting for control of this tiny island,
            the Dutch and British arrived at a compromise settlement, the Treaty
            of Breda, in 1667. Intent on securing their hold over every
            nutmeg-producing island, the Dutch offered a trade: if the British
            would give them the island of Run, they would in turn give Britain a
            distant and much less valuable island in North America. The British
            agreed. That other island was Manhattan, which is how New Amsterdam
            became New York. The Dutch now had a monopoly over the nutmeg trade
            which would last for another century.
          </p>
          <p>
            Then, in 1770, a Frenchman named Pierre Poivre successfully smuggled
            nutmeg plants to safety in Mauritius, an island off the coast of
            Africa. Some of these were later exported to the Caribbean where
            they thrived, especially on the island of Grenada. Next, in 1778, a
            volcanic eruption in the Banda region caused a tsunami that wiped
            out half the nutmeg groves. Finally, in 1809, the British returned
            to Indonesia and seized the Banda Islands by force. They returned
            the islands to the Dutch in 1817, but not before transplanting
            hundreds of nutmeg seedlings to plantations in several locations
            across southern Asia. The Dutch nutmeg monopoly was over.
          </p>
          <p>
            Today, nutmeg is grown in Indonesia, the Caribbean, India, Malaysia,
            Papua New Guinea and Sri Lanka, and world nutmeg production is
            estimated to average between 10,000 and 12,000 tonnes per year.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 1-4</h3>
        <p className="text-blue-800 text-sm">
          Complete the notes below. Choose ONE WORD ONLY from the passage for
          each answer.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold mb-4">The nutmeg tree and fruit</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span>● the leaves of the tree are</span>
            <input
              type="text"
              value={answers[1] || ""}
              onChange={(e) => handleAnswerChange(1, e.target.value)}
              className="border rounded px-2 py-1 w-40"
              placeholder="1"
            />
            <span>in shape</span>
          </div>
          <div className="flex items-center gap-2">
            <span>● the</span>
            <input
              type="text"
              value={answers[2] || ""}
              onChange={(e) => handleAnswerChange(2, e.target.value)}
              className="border rounded px-2 py-1 w-40"
              placeholder="2"
            />
            <span>
              surrounds the fruit and breaks open when the fruit is ripe
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>● the</span>
            <input
              type="text"
              value={answers[3] || ""}
              onChange={(e) => handleAnswerChange(3, e.target.value)}
              className="border rounded px-2 py-1 w-40"
              placeholder="3"
            />
            <span>is used to produce the spice nutmeg</span>
          </div>
          <div className="flex items-center gap-2">
            <span>● the covering known as the aril is used to produce</span>
            <input
              type="text"
              value={answers[4] || ""}
              onChange={(e) => handleAnswerChange(4, e.target.value)}
              className="border rounded px-2 py-1 w-40"
              placeholder="4"
            />
          </div>
          <div>
            <span>● the tree has yellow flowers and fruit</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 5-7</h3>
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
            q: 5,
            text: "In the Middle Ages, most Europeans knew where nutmeg was grown.",
          },
          {
            q: 6,
            text: "The VOC was the world's first major trading company.",
          },
          {
            q: 7,
            text: "Following the Treaty of Breda, the Dutch had control of all the islands where nutmeg grew.",
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

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 8-13</h3>
        <p className="text-blue-800 text-sm">
          Complete the table below. Choose ONE WORD ONLY from the passage for
          each answer.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <table className="w-full">
          <tbody>
            <tr className="border-b">
              <td className="py-3 font-semibold">Middle Ages</td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <span>Nutmeg was brought to Europe by the</span>
                  <input
                    type="text"
                    value={answers[8] || ""}
                    onChange={(e) => handleAnswerChange(8, e.target.value)}
                    className="border rounded px-2 py-1 w-32"
                    placeholder="8"
                  />
                </div>
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-3 font-semibold">16th century</td>
              <td className="py-3">
                European nations took control of the nutmeg trade
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-3 font-semibold">17th century</td>
              <td className="py-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span>
                      Demand for nutmeg grew, as it was believed to be effective
                      against the disease known as the
                    </span>
                    <input
                      type="text"
                      value={answers[9] || ""}
                      onChange={(e) => handleAnswerChange(9, e.target.value)}
                      className="border rounded px-2 py-1 w-32"
                      placeholder="9"
                    />
                  </div>
                  <div className="mt-2">
                    <strong>The Dutch</strong>
                    <ul className="list-disc ml-6 mt-2 space-y-2">
                      <li>took control of the Banda Islands</li>
                      <li>restricted nutmeg production to a few areas</li>
                      <li className="flex items-center gap-2">
                        <span>put</span>
                        <input
                          type="text"
                          value={answers[10] || ""}
                          onChange={(e) =>
                            handleAnswerChange(10, e.target.value)
                          }
                          className="border rounded px-2 py-1 w-32"
                          placeholder="10"
                        />
                        <span>
                          on nutmeg to avoid it being cultivated outside the
                          islands
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span>finally obtained the island of</span>
                        <input
                          type="text"
                          value={answers[11] || ""}
                          onChange={(e) =>
                            handleAnswerChange(11, e.target.value)
                          }
                          className="border rounded px-2 py-1 w-32"
                          placeholder="11"
                        />
                        <span>from the British</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-3 font-semibold">Late 18th century</td>
              <td className="py-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span>1770 – nutmeg plants were secretly taken to</span>
                    <input
                      type="text"
                      value={answers[12] || ""}
                      onChange={(e) => handleAnswerChange(12, e.target.value)}
                      className="border rounded px-2 py-1 w-32"
                      placeholder="12"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>
                      1778 – half the Banda Islands' nutmeg plantations were
                      destroyed by a
                    </span>
                    <input
                      type="text"
                      value={answers[13] || ""}
                      onChange={(e) => handleAnswerChange(13, e.target.value)}
                      className="border rounded px-2 py-1 w-32"
                      placeholder="13"
                    />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPassage2 = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-2xl font-bold mb-4">Driverless cars</h3>
        <div className="prose max-w-none space-y-4 text-gray-700">
          <div>
            <h4 className="font-bold mb-2">A</h4>
            <p>
              The automotive sector is well used to adapting to automation in
              manufacturing. The implementation of robotic car manufacture from
              the 1970s onwards led to significant cost savings and improvements
              in the reliability and flexibility of vehicle mass production. A
              new challenge to vehicle production is now on the horizon and,
              again, it comes from automation. However, this time it is not to
              do with the manufacturing process, but with the vehicles
              themselves.
            </p>
            <p>
              Research projects on vehicle automation are not new. Vehicles with
              limited self-driving capabilities have been around for more than
              50 years, resulting in significant contributions towards driver
              assistance systems. But since Google announced in 2010 that it had
              been trialling self-driving cars on the streets of California,
              progress in this field has quickly gathered pace.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">B</h4>
            <p>
              There are many reasons why technology is advancing so fast. One
              frequently cited motive is safety; indeed, research at the UK's
              Transport Research Laboratory has demonstrated that more than 90
              percent of road collisions involve human error as a contributory
              factor, and it is the primary cause in the vast majority.
              Automation may help to reduce the incidence of this.
            </p>
            <p>
              Another aim is to free the time people spend driving for other
              purposes. If the vehicle can do some or all of the driving, it may
              be possible to be productive, to socialise or simply to relax
              while automation systems have responsibility for safe control of
              the vehicle. If the vehicle can do the driving, those who are
              challenged by existing mobility models – such as older or disabled
              travellers – may be able to enjoy significantly greater travel
              autonomy.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">C</h4>
            <p>
              Beyond these direct benefits, we can consider the wider
              implications for transport and society, and how manufacturing
              processes might need to respond as a result. At present, the
              average car spends more than 90 percent of its life parked.
              Automation means that initiatives for car-sharing become much more
              viable, particularly in urban areas with significant travel
              demand. If a significant proportion of the population choose to
              use shared automated vehicles, mobility demand can be met by far
              fewer vehicles.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">D</h4>
            <p>
              The Massachusetts Institute of Technology investigated automated
              mobility in Singapore, finding that fewer than 30 percent of the
              vehicles currently used would be required if fully automated car
              sharing could be implemented. If this is the case, it might mean
              that we need to manufacture far fewer vehicles to meet demand.
              However, the number of trips being taken would probably increase,
              partly because empty vehicles would have to be moved from one
              customer to the next.
            </p>
            <p>
              Modelling work by the University of Michigan Transportation
              Research Institute suggests automated vehicles might reduce
              vehicle ownership by 43 percent, but that vehicles' average annual
              mileage double as a result. As a consequence, each vehicle would
              be used more intensively, and might need replacing sooner. This
              faster rate of turnover may mean that vehicle production will not
              necessarily decrease.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">E</h4>
            <p>
              Automation may prompt other changes in vehicle manufacture. If we
              move to a model where consumers are tending not to own a single
              vehicle but to purchase access to a range of vehicle through a
              mobility provider, drivers will have the freedom to select one
              that best suits their needs for a particular journey, rather than
              making a compromise across all their requirements.
            </p>
            <p>
              Since, for most of the time, most of the seats in most cars are
              unoccupied, this may boost production of a smaller, more efficient
              range of vehicles that suit the needs of individuals. Specialised
              vehicles may then be available for exceptional journeys, such as
              going on a family camping trip or helping a son or daughter move
              to university.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">F</h4>
            <p>
              There are a number of hurdles to overcome in delivering automated
              vehicles to our roads. These include the technical difficulties in
              ensuring that the vehicle works reliably in the infinite range of
              traffic, weather and road situations it might encounter; the
              regulatory challenges in understanding how liability and
              enforcement might change when drivers are no longer essential for
              vehicle operation; and the societal changes that may be required
              for communities to trust and accept automated vehicles as being a
              valuable part of the mobility landscape.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">G</h4>
            <p>
              It's clear that there are many challenges that need to be
              addressed but, through robust and targeted research, these can
              most probably be conquered within the next 10 years. Mobility will
              change in such potentially significant ways and in association
              with so many other technological developments, such as
              telepresence and virtual reality, that it is hard to make concrete
              predictions about the future. However, one thing is certain:
              change is coming, and the need to be flexible in response to this
              will be vital for those involved in manufacturing the vehicles
              that will deliver future mobility.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 14-18</h3>
        <p className="text-blue-800 text-sm">
          Reading Passage 2 has seven paragraphs, A-G. Which section contains
          the following information?
        </p>
      </div>

      <div className="space-y-3">
        {[
          {
            q: 14,
            text: "reference to the amount of time when a car is not in use",
          },
          {
            q: 15,
            text: "mention of several advantages of driverless vehicles for individual road-users",
          },
          {
            q: 16,
            text: "reference to the opportunity of choosing the most appropriate vehicle for each trip",
          },
          {
            q: 17,
            text: "an estimate of how long it will take to overcome a number of problems",
          },
          {
            q: 18,
            text: "a suggestion that the use of driverless cars may have no effect on the number of vehicles manufactured",
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
        <h3 className="font-semibold text-blue-900 mb-2">Questions 19-22</h3>
        <p className="text-blue-800 text-sm">
          Complete the summary below. Choose NO MORE THAN TWO WORDS from the
          passage for each answer.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold mb-4">The impact of driverless cars</h4>
        <div className="space-y-3">
          <p>
            Figures from the Transport Research Laboratory indicate that most
            motor accidents are partly due to{" "}
            <input
              type="text"
              value={answers[19] || ""}
              onChange={(e) => handleAnswerChange(19, e.target.value)}
              className="border rounded px-2 py-1 w-48 mx-1"
              placeholder="19"
            />
            , so the introduction of driverless vehicles will result in greater
            safety. In addition to the direct benefits of automation, it may
            bring other advantages. For example, schemes for{" "}
            <input
              type="text"
              value={answers[20] || ""}
              onChange={(e) => handleAnswerChange(20, e.target.value)}
              className="border rounded px-2 py-1 w-48 mx-1"
              placeholder="20"
            />{" "}
            will be more workable, especially in towns and cities, resulting in
            fewer cars on the road.
          </p>
          <p>
            According to the University of Michigan Transportation Research
            Institute, there could be a 43 percent drop in{" "}
            <input
              type="text"
              value={answers[21] || ""}
              onChange={(e) => handleAnswerChange(21, e.target.value)}
              className="border rounded px-2 py-1 w-48 mx-1"
              placeholder="21"
            />{" "}
            of cars. However, this would mean that the yearly{" "}
            <input
              type="text"
              value={answers[22] || ""}
              onChange={(e) => handleAnswerChange(22, e.target.value)}
              className="border rounded px-2 py-1 w-48 mx-1"
              placeholder="22"
            />{" "}
            of each car would, on average, be twice as high as it currently is.
            This would lead to a higher turnover of vehicles, and therefore no
            reduction in automotive manufacturing.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          Questions 23 and 24
        </h3>
        <p className="text-blue-800 text-sm">
          Choose TWO letters, A-E. Which TWO benefits of automated vehicles does
          the writer mention?
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border">
        <div className="space-y-2">
          {[
            {
              value: "A",
              text: "Car travellers could enjoy considerable cost savings.",
            },
            {
              value: "B",
              text: "It would be easier to find parking spaces in urban areas.",
            },
            {
              value: "C",
              text: "Travellers could spend journeys doing something other than driving.",
            },
            {
              value: "D",
              text: "People who find driving physically difficult could travel independently.",
            },
            {
              value: "E",
              text: "A reduction in the number of cars would mean a reduction in pollution.",
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
                  if (e.target.checked) {
                    if (!current23) handleAnswerChange(23, value);
                    else if (!current24) handleAnswerChange(24, value);
                  } else {
                    if (current23 === value) handleAnswerChange(23, "");
                    if (current24 === value) handleAnswerChange(24, "");
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
          Choose TWO letters, A-E. Which TWO challenges to automated vehicle
          development does the writer mention?
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border">
        <div className="space-y-2">
          {[
            {
              value: "A",
              text: "making sure the general public has confidence in automated vehicles",
            },
            {
              value: "B",
              text: "managing the pace of transition from conventional to automated vehicles",
            },
            {
              value: "C",
              text: "deciding how to compensate professional drivers who become redundant",
            },
            {
              value: "D",
              text: "setting up the infrastructure to make roads suitable for automated vehicles",
            },
            {
              value: "E",
              text: "getting automated vehicles to adapt to various different driving conditions",
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
                  if (e.target.checked) {
                    if (!current25) handleAnswerChange(25, value);
                    else if (!current26) handleAnswerChange(26, value);
                  } else {
                    if (current25 === value) handleAnswerChange(25, "");
                    if (current26 === value) handleAnswerChange(26, "");
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
        <h3 className="text-2xl font-bold mb-4">What is exploration?</h3>
        <div className="prose max-w-none space-y-4 text-gray-700">
          <p>
            We are all explorers. Our desire to discover, and then share that
            new-found knowledge, is part of what makes us human – indeed, this
            has played an important part in our success as a species. Long
            before the first caveman slumped down beside the fire and grunted
            news that there were plenty of wildebeest over yonder, our ancestors
            had learnt the value of sending out scouts to investigate the
            unknown. This questing nature of ours undoubtedly helped our species
            spread around the globe, just as it nowadays no doubt helps the last
            nomadic Penan maintain their existence in the depleted forests of
            Borneo, and a visitor negotiate the subways of New York.
          </p>
          <p>
            Over the years, we've come to think of explorers as a peculiar breed
            – different from the rest of us, different from those of us who are
            merely 'well travelled', even; and perhaps there is a type of person
            more suited to seeking out the new, a type of caveman more inclined
            to risk venturing out. That, however, doesn't take away from the
            fact that we all have this enquiring instinct, even today; and that
            in all sorts of professions – whether artist, marine biologist or
            astronomer – borders of the unknown are being tested each day.
          </p>
          <p>
            Thomas Hardy set some of his novels in Egdon Heath, a fictional area
            of uncultivated land, and used the landscape to suggest the desires
            and fears of his characters. He is delving into matters we all
            recognise because they are common to humanity. This is surely an act
            of exploration, and into a world as remote as the author chooses.
            Explorer and travel writer Peter Fleming talks of the moment when
            the explorer returns to the existence he has left behind with his
            loved ones. The traveller 'who has for weeks or months seen himself
            only as a puny and irrelevant alien crawling laboriously over a
            country in which he has no roots and no background, suddenly
            encounters his other self, a relatively solid figure, with a place
            in the minds of certain people'.
          </p>
          <p>
            In this book about the exploration of the earth's surface, I have
            confined myself to those whose travels were real and who also aimed
            at more than personal discovery. But that still left me with another
            problem: the word 'explorer' has become associated with a past era.
            We think back to a golden age, as if exploration peaked somehow in
            the 19th century – as if the process of discovery is now on the
            decline, though the truth is that we have named only one and a half
            million of this planet's species, and there may be more than 10
            million – and that's not including bacteria. We have studied only 5
            per cent of the species we know. We have scarcely mapped the ocean
            floors, and know even less about ourselves; we fully understand the
            workings of only 10 per cent of our brains.
          </p>
          <p>
            Here is how some of today's 'explorers' define the word. Ran
            Fiennes, dubbed the 'greatest living explorer', said, 'An explorer
            is someone who has done something that no human has done before –
            and also done something scientifically useful.' Chris Bonington, a
            leading mountaineer, felt exploration was to be found in the act of
            physically touching the unknown: 'You have to have gone somewhere
            new.' Then Robin Hanbury-Tenison, a campaigner on behalf of remote
            so-called 'tribal' peoples, said, 'A traveller simply records
            information about some far-off world, and reports back; but an
            explorer changes the world.' Wilfred Thesiger, who crossed Arabia's
            Empty Quarter in 1946, and belongs to an era of unmechanised travel
            now lost to the rest of us, told me, 'If I'd gone across by camel
            when I could have gone by car, it would have been a stunt.' To him,
            exploration meant bringing back information from a remote place
            regardless of any great self-discovery.
          </p>
          <p>
            Each definition is slightly different – and tends to reflect the
            field of endeavour of each pioneer. It was the same whoever I asked:
            the prominent historian would say exploration was a thing of the
            past, the cutting-edge scientist would say it was of the present.
            And so on. They each set their own particular criteria; the common
            factor in their approach being that they all had, unlike many of us
            who simply enjoy travel or discovering new things, both a very
            definite objective from the outset and also a desire to record their
            findings.
          </p>
          <p>
            I'd best declare my own bias. As a writer, I'm interested in the
            exploration of ideas. I've done a great many expeditions and each
            one was unique. I've lived for months alone with isolated groups of
            people all around the world, even two 'uncontacted tribes'. But none
            of these things is of the slightest interest to anyone unless,
            through my books, I've found a new slant, explored a new idea. Why?
            Because the world has moved on. The time has long passed for the
            great continental voyages – another walk to the poles, another
            crossing of the Empty Quarter. We know how the land surface of our
            planet lies; exploration of it is now down to the details – the
            habits of microbes, say, or the grazing behaviour of buffalo. Aside
            from the deep sea and deep underground, it's the era of specialists.
            However, this is to disregard the role the human mind has in
            conveying remote places; and this is what interests me: how a fresh
            interpretation, even of a well-travelled route, can give its readers
            new insights.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 27-32</h3>
        <p className="text-blue-800 text-sm">
          Choose the correct letter, A, B, C or D.
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            q: 27,
            text: "The writer refers to visitors to New York to illustrate the point that",
            options: [
              "exploration is an intrinsic element of being human.",
              "most people are enthusiastic about exploring.",
              "exploration can lead to surprising results.",
              "most people find exploration daunting.",
            ],
          },
          {
            q: 28,
            text: "According to the second paragraph, what is the writer's view of explorers?",
            options: [
              "Their discoveries have brought both benefits and disadvantages.",
              "Their main value is in teaching others.",
              "They act on an urge that is common to everyone.",
              "They tend to be more attracted to certain professions than to others.",
            ],
          },
          {
            q: 29,
            text: "The writer refers to a description of Egdon Heath to suggest that",
            options: [
              "Hardy was writing about his own experience of exploration.",
              "Hardy was mistaken about the nature of exploration.",
              "Hardy's aim was to investigate people's emotional states.",
              "Hardy's aim was to show the attraction of isolation.",
            ],
          },
          {
            q: 30,
            text: "In the fourth paragraph, the writer refers to 'a golden age' to suggest that",
            options: [
              "the amount of useful information produced by exploration has decreased.",
              "fewer people are interested in exploring than in the 19th century.",
              "recent developments have made exploration less exciting.",
              "we are wrong to think that exploration is no longer necessary.",
            ],
          },
          {
            q: 31,
            text: "In the sixth paragraph, when discussing the definition of exploration, the writer argues that",
            options: [
              "people tend to relate exploration to their own professional interests.",
              "certain people are likely to misunderstand the nature of exploration.",
              "the generally accepted definition has changed over time.",
              "historians and scientists have more valid definitions than the general public.",
            ],
          },
          {
            q: 32,
            text: "In the last paragraph, the writer explains that he is interested in",
            options: [
              "how someone's personality is reflected in their choice of places to visit.",
              "the human ability to cast new light on places that may be familiar.",
              "how travel writing has evolved to meet changing demands.",
              "the feelings that writers develop about the places that they explore.",
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
        <h3 className="font-semibold text-blue-900 mb-2">Questions 33-37</h3>
        <p className="text-blue-800 text-sm">
          Look at the following statements and the list of explorers below.
          Match each statement with the correct explorer, A-E. You may use any
          letter more than once.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border mb-4">
        <div className="space-y-2 text-sm">
          <p>
            <strong>A</strong> Peter Fleming
          </p>
          <p>
            <strong>B</strong> Ran Fiennes
          </p>
          <p>
            <strong>C</strong> Chris Bonington
          </p>
          <p>
            <strong>D</strong> Robin Hanbury-Tenison
          </p>
          <p>
            <strong>E</strong> Wilfred Thesiger
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {[
          {
            q: 33,
            text: "He referred to the relevance of the form of transport used.",
          },
          {
            q: 34,
            text: "He described feelings on coming back home after a long journey.",
          },
          {
            q: 35,
            text: "He worked for the benefit of specific groups of people.",
          },
          {
            q: 36,
            text: "He did not consider learning about oneself an essential part of exploration.",
          },
          {
            q: 37,
            text: "He defined exploration as being both unique and of value to others.",
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
              placeholder="A-E"
              maxLength={1}
            />
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 38-40</h3>
        <p className="text-blue-800 text-sm">
          Complete the summary below. Choose NO MORE THAN TWO WORDS from the
          passage for each answer.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold mb-4">The writer's own bias</h4>
        <p>
          The writer has experience of a large number of{" "}
          <input
            type="text"
            value={answers[38] || ""}
            onChange={(e) => handleAnswerChange(38, e.target.value)}
            className="border rounded px-2 py-1 w-40 mx-1"
            placeholder="38"
          />
          , and was the first stranger that certain previously{" "}
          <input
            type="text"
            value={answers[39] || ""}
            onChange={(e) => handleAnswerChange(39, e.target.value)}
            className="border rounded px-2 py-1 w-40 mx-1"
            placeholder="39"
          />{" "}
          people had encountered. He believes there is no need for further
          exploration of Earth's{" "}
          <input
            type="text"
            value={answers[40] || ""}
            onChange={(e) => handleAnswerChange(40, e.target.value)}
            className="border rounded px-2 py-1 w-40 mx-1"
            placeholder="40"
          />
          , except to answer specific questions such as how buffalo eat.
        </p>
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
            IELTS Reading Test 1 - Passage {currentPassage}
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

export default ReadingTest1;
