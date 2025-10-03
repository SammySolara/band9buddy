import { useState, useEffect } from "react";
import { X, Volume2, Loader, Plus } from "lucide-react";
import { useFlashcards } from "../../contexts/FlashcardContext";
import AddToFlashcardModal from "../flashcards/AddToFlashCardModal";

const QuickDefineModal = ({ word, position, onClose }) => {
  const [wordData, setWordData] = useState(null);
  const [vietnameseTranslation, setVietnameseTranslation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddToFlashcard, setShowAddToFlashcard] = useState(false);
  const [selectedDefinition, setSelectedDefinition] = useState(null);

  useEffect(() => {
    const fetchWord = async () => {
      if (!word) return;

      setLoading(true);
      setError(null);
      setVietnameseTranslation(null);

      try {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
        );

        if (!response.ok) throw new Error("Word not found");

        const data = await response.json();
        setWordData(data[0]);

        // Fetch Vietnamese translation
        fetchVietnameseTranslation(word);
      } catch (err) {
        setError(err.message);
        setWordData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWord();
  }, [word]);

  const fetchVietnameseTranslation = async (w) => {
    try {
      const response = await fetch(
        `https://freedictionaryapi.com/api/v1/entries/en/${w.toLowerCase()}?translations=true`
      );

      if (response.ok) {
        const data = await response.json();
        const translations = [];

        if (data && data.entries) {
          for (const entry of data.entries) {
            if (entry.senses) {
              for (const sense of entry.senses) {
                if (sense.translations) {
                  sense.translations.forEach((t) => {
                    if (t.language && t.language.code === "vi") {
                      translations.push(t.word);
                    }
                  });
                }
              }
            }
          }
        }

        if (translations.length > 0) {
          setVietnameseTranslation([...new Set(translations)].join(", "));
        }
      }
    } catch (err) {
      console.log("Vietnamese translation fetch failed:", err);
    }
  };

  const playPronunciation = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play().catch((err) => console.log("Audio play failed:", err));
  };

  const handleAddToFlashcard = (definition) => {
    setSelectedDefinition(definition);
    setShowAddToFlashcard(true);
  };

  const getDefaultDefinition = () => {
    if (!wordData || !wordData.meanings || wordData.meanings.length === 0) {
      return {
        cleanDefinition: "No definition available",
        displayDefinition: "No definition available",
        tags: [],
      };
    }

    const firstMeaning = wordData.meanings[0];
    const partOfSpeech = firstMeaning.partOfSpeech;
    const firstDef =
      firstMeaning.definitions[0]?.definition || "No definition available";

    let displayDefinition = `(${partOfSpeech}) ${firstDef}`;
    let cleanDefinition = firstDef;
    const tags = [partOfSpeech];

    if (vietnameseTranslation) {
      displayDefinition += `\n\nVietnamese: ${vietnameseTranslation}`;
      cleanDefinition += `\n\nVietnamese: ${vietnameseTranslation}`;
    }

    return {
      cleanDefinition,
      displayDefinition,
      tags,
    };
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-20 z-[9998] flex items-center justify-center"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden w-full max-w-[380px] mx-4 max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <h3 className="font-semibold">Quick Define</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-60px)] p-4">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
            )}

            {error && (
              <div className="text-center py-6">
                <p className="text-red-600 text-sm">
                  Word not found. Try checking the spelling.
                </p>
              </div>
            )}

            {wordData && (
              <div className="space-y-4">
                {/* Word */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {wordData.word}
                  </h2>

                  {/* Vietnamese Translation */}
                  {vietnameseTranslation && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                      <span className="font-medium text-blue-800">
                        Vietnamese:{" "}
                      </span>
                      <span className="text-blue-700">
                        {vietnameseTranslation}
                      </span>
                    </div>
                  )}
                </div>

                {/* Pronunciation */}
                {wordData.phonetics && wordData.phonetics.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    {wordData.phonetics[0].text && (
                      <span className="text-blue-600 font-mono">
                        {wordData.phonetics[0].text}
                      </span>
                    )}
                    {wordData.phonetics.find((p) => p.audio) && (
                      <button
                        onClick={() =>
                          playPronunciation(
                            wordData.phonetics.find((p) => p.audio).audio
                          )
                        }
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}

                {/* Add to Flashcard Button */}
                <button
                  onClick={() => handleAddToFlashcard(getDefaultDefinition())}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add to Flashcards</span>
                </button>

                {/* Meanings */}
                <div className="space-y-3">
                  {wordData.meanings.slice(0, 2).map((meaning, idx) => (
                    <div key={idx} className="border-l-2 border-blue-500 pl-3">
                      <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded mb-2">
                        {meaning.partOfSpeech}
                      </span>

                      <div className="space-y-2">
                        {meaning.definitions.slice(0, 2).map((def, defIdx) => (
                          <div key={defIdx} className="text-sm">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="text-gray-700">
                                  {def.definition}
                                </p>
                                {def.example && (
                                  <p className="text-gray-500 italic text-xs mt-1">
                                    "{def.example}"
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  let cleanDefinition = def.definition;
                                  let displayDefinition = `(${meaning.partOfSpeech}) ${def.definition}`;
                                  const tags = [meaning.partOfSpeech];

                                  if (vietnameseTranslation) {
                                    cleanDefinition += `\n\nVietnamese: ${vietnameseTranslation}`;
                                    displayDefinition += `\n\nVietnamese: ${vietnameseTranslation}`;
                                  }

                                  handleAddToFlashcard({
                                    cleanDefinition,
                                    displayDefinition,
                                    tags,
                                  });
                                }}
                                className="flex-shrink-0 p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Add this definition"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* View Full Definition Link */}
                <div className="pt-3 border-t border-gray-200">
                  <a
                    href={`/dashboard/dictionary?word=${word}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View full definition →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add to Flashcard Modal */}
      {showAddToFlashcard && selectedDefinition && (
        <AddToFlashcardModal
          word={word}
          definition={selectedDefinition}
          onClose={() => {
            setShowAddToFlashcard(false);
            setSelectedDefinition(null);
          }}
          onSuccess={() => {
            // Optional: Show success message or keep modal open
            setShowAddToFlashcard(false);
            setSelectedDefinition(null);
          }}
        />
      )}
    </>
  );
};

export default QuickDefineModal;
