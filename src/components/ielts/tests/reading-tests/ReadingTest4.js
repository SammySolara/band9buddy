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

const ReadingTest4 = ({ onComplete, onExit }) => {
  const [currentPassage, setCurrentPassage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const timerRef = useRef(null);

  const answerKey = {
    1: "FALSE",
    2: "FALSE",
    3: "FALSE",
    4: "NOT GIVEN",
    5: "TRUE",
    6: "TRUE",
    7: "bulbs",
    8: "soil",
    9: "feathers",
    10: "deer",
    11: "1980",
    12: "funding",
    13: "stakeholders",
    14: "C",
    15: "G",
    16: "B",
    17: "E",
    18: "C",
    19: "B",
    20: "A",
    21: "B",
    22: "C",
    23: "A",
    24: "oak",
    25: "flooring",
    26: "keel",
    27: "C",
    28: "A",
    29: "D",
    30: "C",
    31: "B",
    32: "G",
    33: "C",
    34: "E",
    35: "D",
    36: "YES",
    37: "NOT GIVEN",
    38: "NO",
    39: "YES",
    40: "YES",
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
        <h3 className="text-2xl font-bold mb-4">The kākāpō</h3>
        <h4 className="text-lg italic mb-4">
          The kākāpō is a nocturnal, flightless parrot that is critically
          endangered and one of New Zealand's unique treasures
        </h4>
        <div className="prose max-w-none space-y-4 text-gray-700">
          <p>
            The kākāpō, also known as the owl parrot, is a large,
            forest-dwelling bird, with a pale owl-like face. Up to 64 cm in
            length, it has predominantly yellow-green feathers, forward-facing
            eyes, a large grey beak, large blue feet, and relatively short wings
            and tail. It is the world's only flightless parrot, and is also
            possibly one of the world's longest-living birds, with a reported
            lifespan of up to 100 years.
          </p>
          <p>
            Kākāpō are solitary birds and tend to occupy the same home range for
            many years. They forage on the ground and climb high into trees.
            They often leap from trees and flap their wings, but at best manage
            a controlled descent to the ground. They are entirely vegetarian,
            with their diet including the leaves, roots and bark of trees as
            well as bulbs, and fern fronds.
          </p>
          <p>
            Kākāpō breed in summer and autumn, but only in years when food is
            plentiful. Males play no part in incubation or chick-rearing —
            females alone incubate eggs and feed the chicks. The 1-4 eggs are
            laid in soil, which is repeatedly turned over before and during
            incubation. The female kākāpō has to spend long periods away from
            the nest searching for food, which leaves the unattended eggs and
            chicks particularly vulnerable to predators.
          </p>
          <p>
            Before humans arrived, kākāpō were common throughout New Zealand's
            forests. However, this all changed with the arrival of the first
            Polynesian settlers about 700 years ago. For the early settlers, the
            flightless kākāpō was easy prey. They ate its meat and used its
            feathers to make soft cloaks. With them came the Polynesian dog and
            rat, which also preyed on kākāpō. By the time European colonisers
            arrived in the early 1800s, kākāpō had become confined to the
            central North Island and forested parts of the South Island. The
            fall in kākāpō numbers was accelerated by European colonisation. A
            great deal of habitat was lost through forest clearance, and
            introduced species such as deer depleted the remaining forests of
            food. Other predators such as cats, stoats and two more species of
            rat were also introduced. The kākāpō were in serious trouble.
          </p>
          <p>
            In 1894, the New Zealand government launched its first attempt to
            save the kākāpō. Conservationist Richard Henry led an effort to
            relocate several hundred of the birds to predator-free Resolution
            Island in Fiordland. Unfortunately, the island didn't remain
            predator free — stoats arrived within six years, eventually
            destroying the kākāpō population. By the mid-1900s, the kākāpō was
            practically a lost species. Only a few clung to life in the most
            isolated parts of New Zealand.
          </p>
          <p>
            From 1949 to 1973, the newly formed New Zealand Wildlife Service
            made over 60 expeditions to find kākāpō, focusing mainly on
            Fiordland. Six were caught, but there were no females amongst them
            and all but one died within a few months of captivity. In 1974, a
            new initiative was launched, and by 1977, 18 more kākāpō were found
            in Fiordland. However, there were still no females. In 1977, a large
            population of males was spotted in Rakiura — a large island free
            from stoats, ferrets and weasels. There were about 200 individuals,
            and in 1980 it was confirmed females were also present. These birds
            have been the foundation of all subsequent work in managing the
            species.
          </p>
          <p>
            Unfortunately, predation by feral cats on Rakiura Island led to a
            rapid decline in kākāpō numbers. As a result, during 1980-97, the
            surviving population was evacuated to three island sanctuaries:
            Codfish Island, Maud Island and Little Barrier Island. However,
            breeding success was hard to achieve. Rats were found to be a major
            predator of kākāpō chicks and an insufficient number of chicks
            survived to offset adult mortality. By 1995, although at least 12
            chicks had been produced on the islands, only three had survived.
            The kākāpō population had dropped to 51 birds. The critical
            situation prompted an urgent review of kākāpō management in New
            Zealand.
          </p>
          <p>
            In 1996, a new Recovery Plan was launched, together with a
            specialist advisory group called the Kākāpō Scientific and Technical
            Advisory Committee and a higher amount of funding. Renewed steps
            were taken to control predators on the three islands. Cats were
            eradicated from Little Barrier Island in 1980, and possums were
            eradicated from Codfish Island by 1986. However, the population did
            not start to increase until rats were removed from all three
            islands, and the birds were more intensively managed. This involved
            moving the birds between islands, supplementary feeding of adults
            and rescuing and hand-raising any failing chicks.
          </p>
          <p>
            After the first five years of the Recovery Plan, the population was
            on target. By 2000, five new females had been produced, and the
            total population had grown to 62 birds. For the first time, there
            was cautious optimism for the future of kākāpō and by June 2020, a
            total of 210 birds was recorded.
          </p>
          <p>
            Today, kākāpō management continues to be guided by the kākāpō
            Recovery Plan. Its key goals are: minimise the loss of genetic
            diversity in the kākāpō population, restore or maintain sufficient
            habitat to accommodate the expected increase in the kākāpō
            population, and ensure stakeholders continue to be fully engaged in
            the preservation of the species.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 1-6</h3>
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
            q: 1,
            text: "There are other parrots that share the kakapo's inability to fly.",
          },
          { q: 2, text: "Adult kakapo produce chicks every year." },
          {
            q: 3,
            text: "Adult male kakapo bring food back to nesting females.",
          },
          {
            q: 4,
            text: "The Polynesian rat was a greater threat to the kakapo than Polynesian settlers.",
          },
          {
            q: 5,
            text: "Kakapo were transferred from Rakiura Island to other locations because they were at risk from feral cats.",
          },
          {
            q: 6,
            text: "One Recovery Plan initiative that helped increase the kakapo population size was caring for struggling young birds.",
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
        <h3 className="font-semibold text-blue-900 mb-2">Questions 7-13</h3>
        <p className="text-blue-800 text-sm">
          Complete the notes below. Choose ONE WORD AND/OR A NUMBER from the
          passage for each answer.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold mb-4">New Zealand's kākāpō</h4>
        <div className="space-y-4">
          <div>
            <h5 className="font-semibold mb-2">A type of parrot:</h5>
            <p>
              • diet consists of fern fronds, various parts of a tree and{" "}
              <input
                type="text"
                value={answers[7] || ""}
                onChange={(e) => handleAnswerChange(7, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="7"
              />
            </p>
            <p>
              • nests are created in{" "}
              <input
                type="text"
                value={answers[8] || ""}
                onChange={(e) => handleAnswerChange(8, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="8"
              />{" "}
              where eggs are laid.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">
              Arrival of Polynesian settlers
            </h5>
            <p>
              • the{" "}
              <input
                type="text"
                value={answers[9] || ""}
                onChange={(e) => handleAnswerChange(9, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="9"
              />{" "}
              of the kākāpō were used to make clothes.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">
              Arrival of European colonisers
            </h5>
            <p>
              •{" "}
              <input
                type="text"
                value={answers[10] || ""}
                onChange={(e) => handleAnswerChange(10, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="10"
              />{" "}
              were an animal which they introduced that ate the kākāpō's food
              sources.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Protecting kākāpō</h5>
            <p>
              • Richard Henry, a conservationist, tried to protect the kākāpō.
            </p>
            <p>
              • a definite sighting of female kākāpō on Rakiura Island was
              reported in the year{" "}
              <input
                type="text"
                value={answers[11] || ""}
                onChange={(e) => handleAnswerChange(11, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="11"
              />
            </p>
            <p>
              • the Recovery Plan included an increase in{" "}
              <input
                type="text"
                value={answers[12] || ""}
                onChange={(e) => handleAnswerChange(12, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="12"
              />
            </p>
            <p>
              • a current goal of the Recovery Plan is to maintain the
              involvement of{" "}
              <input
                type="text"
                value={answers[13] || ""}
                onChange={(e) => handleAnswerChange(13, e.target.value)}
                className="border rounded px-2 py-1 w-32 mx-1"
                placeholder="13"
              />{" "}
              in kākāpō protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPassage2 = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-2xl font-bold mb-4">To Britain</h3>
        <h4 className="text-lg italic mb-4">
          Mark Rowe investigates attempts to reintroduce elms to Britain
        </h4>
        <div className="prose max-w-none space-y-4 text-gray-700">
          <div>
            <h4 className="font-bold mb-2">A</h4>
            <p>
              Around 25 million elms, accounting for 90% of all elm trees in the
              UK, died during the 1960s and '70s of Dutch elm disease. In the
              aftermath, the elm, once so dominant in the British landscape, was
              largely forgotten. However, there's now hope the elm may be
              reintroduced to the countryside of central and southern England.
              Any reintroduction will start from a very low base. 'The impact of
              the disease is difficult to picture if you hadn't seen what was
              there before,' says Matt Elliot of the Woodland Trust. 'You look
              at old photographs from the 1960s and it's only then that you
              realise the impact [elms had] … They were significant, large
              trees… then they were gone.'
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">B</h4>
            <p>
              The disease is caused by a fungus that blocks the elms' vascular
              (water, nutrient and food transport) system, causing branches to
              wilt and die. A first epidemic, which occurred in the 1920s,
              gradually died down, but in the '70s a second epidemic was
              triggered by shipments of elm from Canada. The wood came in the
              form of logs destined for boat building and its intact bark was
              perfect for the elm bark beetles that spread the deadly fungus.
              This time, the beetles carried a much more virulent strain that
              destroyed the vast majority of British elms.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">C</h4>
            <p>
              Today, elms still exist in the southern English countryside but
              mostly only in low hedgerows between fields. 'We have millions of
              small elms in hedgerows but they get targeted by the beetle as
              soon as they reach a certain size,' says Karen Russell, co-author
              of the report 'Where we are with elm'. Once the trunk of the elm
              reaches 10-15 centimetres or so in diameter, it becomes a perfect
              size for beetles to lay eggs and for the fungus to take hold. Yet
              mature specimens have been identified, in counties such as
              Cambridgeshire, that are hundreds of years old, and have
              mysteriously escaped the epidemic.
            </p>
            <p>
              The key, Russell says, is to identify and study those trees that
              have survived and work out why they stood tall when millions of
              others succumbed. Nevertheless, opportunities are limited as the
              number of these mature survivors is relatively small. 'What are
              the reasons for their survival?' asks Russell. 'Avoidance,
              tolerance, resistance? We don't know where the balance lies
              between the three. I don't see how it can be entirely down to
              luck.'
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">D</h4>
            <p>
              For centuries, elm ran a close second to oak as the hardwood tree
              of choice in Britain and was in many instances the most prominent
              tree in the landscape. Not only was elm common in European
              forests, it became a key component of birch, ash and hazel
              woodlands. The use of elm is thought to go back to the Bronze Age,
              when it was widely used for tools. Elm was also the preferred
              material for shields and early swords. In the 18th century, it was
              planted more widely and its wood was used for items such as
              storage crates and flooring. It was also suitable for items that
              experienced high levels of impact and was used to build the keel
              of the 19th-century sailing ship Cutty Sark as well as mining
              equipment.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">E</h4>
            <p>
              Given how ingrained elm is in British culture, it's unsurprising
              the tree has many advocates. Amongst them is Peter Bourne of the
              National Elm Collection in Brighton. 'I saw Dutch elm disease
              unfold as a small boy,' he says. 'The elm seemed to be part of
              rural England, but I remember watching trees just lose their
              leaves and that really stayed with me.' Today, the city of
              Brighton's elms total about 17,000. Local factors appear to have
              contributed to their survival. Strong winds from the sea make it
              difficult for the determined elm bark beetle to attack this
              coastal city's elm population. However, the situation is
              precarious. 'The beetles can just march in if we're not careful,
              as the threat is right on our doorstep,' says Bourne.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">F</h4>
            <p>
              Any prospect of the elm returning relies heavily on trees being
              either resistant to, or tolerant of, the disease. This means a
              widespread reintroduction would involve existing or new hybrid
              strains derived from resistant, generally non-native elm species.
              A new generation of seedlings have been bred and tested to see if
              they can withstand the fungus by cutting a small slit on the bark
              and injecting a tiny amount of the pathogen. 'The effects are very
              quick,' says Russell. 'You return in four to six weeks and trees
              that are resistant show no symptoms, whereas those that are
              susceptible show leaf loss and may even have died completely.'
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">G</h4>
            <p>
              All of this raises questions of social acceptance, acknowledges
              Russell. 'If we're putting elm back into the landscape, a small
              element of it is not native — are we bothered about that?' For
              her, the environmental case for reintroducing elm is strong. 'They
              will host wildlife, which is a good thing.' Others are more wary.
              'On the face of it, it seems like a good idea,' says Elliot. The
              problem, he suggests, is that, 'You're replacing a native species
              with a horticultural analogue. You're effectively cloning.'
              There's also the risk of introducing new diseases. Rather than
              plant new elms, the Woodland Trust emphasises providing space to
              those elms that have survived independently. 'Sometimes the best
              thing you can do is just give nature time to recover over time,
              you might get resistance,' says Elliot.
            </p>
            <p className="text-sm italic">
              * horticultural analogue: a cultivated plant species that is
              genetically similar to an existing species
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 14-18</h3>
        <p className="text-blue-800 text-sm">
          Reading Passage 2 has seven sections, A–G. Which section contains the
          following information? You may use any letter more than once.
        </p>
      </div>

      <div className="space-y-3">
        {[
          {
            q: 14,
            text: "reference to the research problems that arise from there being only a few surviving large elms",
          },
          {
            q: 15,
            text: "details of a difference of opinion about the value of reintroducing elms to Britain",
          },
          {
            q: 16,
            text: "reference to how Dutch elm disease was brought into Britain",
          },
          {
            q: 17,
            text: "a description of the conditions that have enabled a location in Britain to escape Dutch elm disease",
          },
          {
            q: 18,
            text: "reference to the stage at which young elms become vulnerable to Dutch elm disease",
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
        <h3 className="font-semibold text-blue-900 mb-2">Questions 19-23</h3>
        <p className="text-blue-800 text-sm">
          Look at the following statements and the list of people below. Match
          each statement with the correct person, A, B, or C. You may use any
          letter more than once.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border mb-4">
        <div className="space-y-2 text-sm">
          <p>
            <strong>A</strong> Matt Elliot
          </p>
          <p>
            <strong>B</strong> Karen Russell
          </p>
          <p>
            <strong>C</strong> Peter Bourne
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {[
          {
            q: 19,
            text: "If a tree gets infected with Dutch elm disease, the damage rapidly becomes visible.",
          },
          {
            q: 20,
            text: "It may be better to wait and see if the mature elms that have survived continue to flourish.",
          },
          {
            q: 21,
            text: "There must be an explanation for the survival of some mature elms.",
          },
          {
            q: 22,
            text: "We need to be aware that insects carrying Dutch elm disease are not very far away.",
          },
          {
            q: 23,
            text: "You understand the effect Dutch elm disease has had when you see evidence of how prominent the tree once was.",
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
        <h3 className="font-semibold text-blue-900 mb-2">Questions 24-26</h3>
        <p className="text-blue-800 text-sm">
          Complete the summary below. Choose ONE WORD ONLY from the passage for
          each answer.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-bold mb-4">Uses of a popular tree</h4>
        <div className="space-y-3">
          <p>
            For hundreds of years, the only tree that was more popular in
            Britain than elm was{" "}
            <input
              type="text"
              value={answers[24] || ""}
              onChange={(e) => handleAnswerChange(24, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="24"
            />
            . Starting in the Bronze Age, many tools were made from elm and
            people also used it to make weapons. In the 18th century, it was
            grown to provide wood for boxes and{" "}
            <input
              type="text"
              value={answers[25] || ""}
              onChange={(e) => handleAnswerChange(25, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="25"
            />
            . Due to its strength, elm was often used for mining equipment and
            the Cutty Sark's{" "}
            <input
              type="text"
              value={answers[26] || ""}
              onChange={(e) => handleAnswerChange(26, e.target.value)}
              className="border rounded px-2 py-1 w-32 mx-1"
              placeholder="26"
            />{" "}
            was also constructed from elm.
          </p>
        </div>
      </div>
    </div>
  );

  const renderPassage3 = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-2xl font-bold mb-4">
          How stress affects our judgement
        </h3>
        <div className="prose max-w-none space-y-4 text-gray-700">
          <p>
            Some of the most important decisions of our lives occur while we're
            feeling stressed and anxious. From medical decisions to financial
            and professional ones, we are all sometimes required to weigh up
            information under stressful conditions. But do we become better or
            worse at processing and using information under such circumstances?
          </p>
          <p>
            My colleague and I, both neuroscientists, wanted to investigate how
            the mind operates under stress, so we visited some local fire
            stations. Firefighters' workdays vary quite a bit. Some are pretty
            relaxed; they'll spend their time washing the truck, cleaning
            equipment, cooking meals and reading. Other days can be hectic, with
            numerous life-threatening incidents to attend to; they'll enter
            burning homes to rescue trapped residents, and assist with medical
            emergencies. These ups and downs presented the perfect setting for
            an experiment on how people's ability to use information changes
            when they feel under pressure.
          </p>
          <p>
            We found that perceived threat acted as a trigger for a stress
            reaction that made the task of processing information easier for the
            firefighters — but only as long as it conveyed bad news.
          </p>
          <p>
            This is how we arrived at these results. We asked the firefighters
            to estimate their likelihood of experiencing 40 different adverse
            events in their life, such as being involved in an accident or
            becoming a victim of card fraud. We then gave them either good news
            (that their likelihood of experiencing these events was lower than
            they'd thought) or bad news (that it was higher) and asked them to
            provide new estimates.
          </p>
          <p>
            People are normally quite optimistic — they will ignore bad news and
            embrace the good. This is what happened when the firefighters were
            relaxed; but when they were under stress, a different pattern
            emerged. Under these conditions, they became hyper-vigilant to bad
            news, even when it had nothing to do with their job (such as
            learning that the likelihood of card fraud was higher than they'd
            thought), and altered their beliefs in response. In contrast, stress
            didn't change how they responded to good news (such as learning that
            the likelihood of card fraud was lower than they'd thought).
          </p>
          <p>
            Back in our lab, we observed the same pattern in students who were
            told they had to give a surprise public speech, which would be
            judged by a panel, recorded and posted online. Sure enough, their
            cortisol levels spiked, their heart rates went up and they suddenly
            became better at processing unrelated, yet alarming, information
            about rates of disease and violence.
          </p>
          <p>
            When we experience stressful events, a physiological change is
            triggered that causes us to take in warnings and focus on what might
            go wrong. Brain imaging reveals that this 'switch' is related to a
            sudden boost in a neural signal important for learning, specifically
            in response to unexpected warning signs, such as faces expressing
            fear.
          </p>
          <p>
            Such neural engineering could have helped prehistoric humans to
            survive. When our ancestors found themselves surrounded by hungry
            animals, they would have benefited from an increased ability to
            learn about hazards. In a safe environment, however, it would have
            been wasteful to be on high alert constantly. So, a neural switch
            that automatically increases or decreases our ability to process
            warnings in response to changes in our environment could have been
            useful. In fact, people with clinical depression and anxiety seem
            unable to switch away from a state in which they absorb all the
            negative messages around them.
          </p>
          <p>
            It is also important to realise that stress travels rapidly from one
            person to the next. If a co-worker is stressed, we are more likely
            to tense up and feel stressed ourselves. We don't even need to be in
            the same room with someone for their emotions to influence our
            behaviour. Studies show that if we observe positive feeds on social
            media, such as images of a pink sunset, we are more likely to post
            uplifting messages ourselves. If we observe negative posts, such as
            complaints about a long queue at the coffee shop, we will in turn
            create more negative posts.
          </p>
          <p>
            In some ways, many of us now live as if we are in danger, constantly
            ready to tackle demanding emails and text messages, and respond to
            news alerts and comments on social media. Repeatedly checking your
            phone, according to a survey conducted by the American Psychological
            Association, is related to stress. In other words, a pre-programmed
            physiological reaction, which evolution has equipped us with to help
            us avoid famished predators, is now being triggered by an online
            post. Social media posting, according to one study, raises your
            pulse, makes you sweat, and enlarges your pupils more than most
            daily activities.
          </p>
          <p>
            The fact that stress increases the likelihood that we will focus
            more on alarming messages, together with the fact that it spreads
            extremely rapidly, can create collective fear that is not always
            justified. After a stressful public event, such as a natural
            disaster or major financial crash, there is often a wave of alarming
            information in traditional and social media, which individuals
            become very aware of. But that has the effect of exaggerating
            existing danger. And so, a reliable pattern emerges — stress is
            triggered, spreading from one person to the next, which temporarily
            enhances the likelihood that people will take in negative reports,
            which increases stress further. As a result, trips are cancelled,
            even if the disaster took place across the globe; stocks are sold,
            even when holding on is the best thing to do. The good news,
            however, is that positive emotions, such as hope, are contagious
            too, and are powerful in inducing people to act to find solutions.
            Being aware of the close relationship between people's emotional
            state and how they process information can help us frame our
            messages more effectively and become conscientious agents of change.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Questions 27-30</h3>
        <p className="text-blue-800 text-sm">
          Choose the correct letter, A, B, C or D.
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            q: 27,
            text: "In the first paragraph, the writer introduces the topic of the text by",
            options: [
              "defining some commonly used terms.",
              "questioning a widely held assumption.",
              "mentioning a challenge faced by everyone.",
              "specifying a situation which makes us most anxious.",
            ],
          },
          {
            q: 28,
            text: "What point does the writer make about firefighters in the second paragraph?",
            options: [
              "The regular changes of stress levels in their working lives make them ideal study subjects.",
              "The strategies they use to handle stress are of particular interest to researchers.",
              "The stressful nature of their job is typical of many public service professions.",
              "Their personalities make them especially well-suited to working under stress.",
            ],
          },
          {
            q: 29,
            text: "What is the writer doing in the fourth paragraph?",
            options: [
              "explaining their findings",
              "justifying their approach",
              "setting out their objectives",
              "describing their methodology",
            ],
          },
          {
            q: 30,
            text: "In the seventh paragraph, the writer describes a mechanism in the brain which",
            options: [
              "enables people to respond more quickly to stressful situations.",
              "results in increased ability to control our levels of anxiety.",
              "produces heightened sensitivity to indications of external threats.",
              "is activated when there is a need to communicate a sense of danger.",
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
        <h3 className="font-semibold text-blue-900 mb-2">Questions 31-35</h3>
        <p className="text-blue-800 text-sm">
          Complete each sentence with the correct ending, A–G, below.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border mb-4">
        <div className="space-y-2 text-sm">
          <p>
            <strong>A</strong> made them feel optimistic.
          </p>
          <p>
            <strong>B</strong> took relatively little notice of bad news.
          </p>
          <p>
            <strong>C</strong> responded to negative and positive information in
            the same way.
          </p>
          <p>
            <strong>D</strong> were feeling under stress.
          </p>
          <p>
            <strong>E</strong> put them in a stressful situation.
          </p>
          <p>
            <strong>F</strong> behaved in a similar manner, regardless of the
            circumstances.
          </p>
          <p>
            <strong>G</strong> thought it more likely that they would experience
            something bad.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {[
          {
            q: 31,
            text: "At times when they were relaxed, the firefighters usually",
          },
          {
            q: 32,
            text: "The researchers noted that when the firefighters were stressed, they",
          },
          {
            q: 33,
            text: "When the firefighters were told good news, they always",
          },
          {
            q: 34,
            text: "The students' cortisol levels and heart rates were affected when the researchers",
          },
          {
            q: 35,
            text: "In both experiments, negative information was processed better when the subjects",
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
        <h3 className="font-semibold text-blue-900 mb-2">Questions 36-40</h3>
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
            q: 36,
            text: "The tone of the content we post on social media tends to reflect the nature of the posts in our feeds.",
          },
          {
            q: 37,
            text: "Phones have a greater impact on our stress levels than other electronic media devices.",
          },
          {
            q: 38,
            text: "The more we read about a stressful public event on social media, the less able we are to take the information in.",
          },
          {
            q: 39,
            text: "Stress created by social media posts can lead us to take unnecessary precautions.",
          },
          {
            q: 40,
            text: "Our tendency to be affected by other people's moods can be used in a positive way.",
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
            IELTS Reading Test 4 - Passage {currentPassage}
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

export default ReadingTest4;
