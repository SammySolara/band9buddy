import { useState, useEffect } from "react";
import { X, Plus, Check, Loader } from "lucide-react";
import { useFlashcards } from "../../contexts/FlashcardContext";

const AddToFlashcardModal = ({ word, definition, onClose, onSuccess }) => {
  const { sets, createSet, addCard } = useFlashcards();
  const [selectedSetId, setSelectedSetId] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newSetTitle, setNewSetTitle] = useState("");
  const [newSetDescription, setNewSetDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-select first set if available
  useEffect(() => {
    if (sets.length > 0 && !selectedSetId) {
      setSelectedSetId(sets[0].id);
    }
  }, [sets, selectedSetId]);

  const normalizeTag = (tag) => {
    // Capitalize first letter to match predefined tags (Noun, Verb, etc.)
    return tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
  };

  const handleAddToExistingSet = async () => {
    if (!selectedSetId) {
      setError("Please select a set");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const normalizedTags = (definition.tags || []).map(normalizeTag);
      const result = await addCard(selectedSetId, {
        front: word,
        back: definition.cleanDefinition,
        tags: normalizedTags,
      });

      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(result.error || "Failed to add card");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewSet = async () => {
    if (!newSetTitle.trim()) {
      setError("Please enter a set title");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const normalizedTags = (definition.tags || []).map(normalizeTag);
      const result = await createSet({
        title: newSetTitle.trim(),
        description: newSetDescription.trim() || "",
        color: "#3B82F6",
        cards: [
          {
            front: word,
            back: definition.cleanDefinition,
            tags: normalizedTags,
          },
        ],
      });

      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(result.error || "Failed to create set");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Add to Flashcard Set
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          {/* Word Preview */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-800 font-medium mb-1">Word:</div>
            <div className="text-lg font-bold text-blue-900">{word}</div>
            <div className="text-sm text-blue-700 mt-2 line-clamp-3">
              {definition.displayDefinition}
            </div>
            {definition.tags && definition.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {definition.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-blue-200 text-blue-800 text-xs rounded"
                  >
                    {normalizeTag(tag)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tab Selection */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setIsCreatingNew(false)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                !isCreatingNew
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Existing Set
            </button>
            <button
              onClick={() => setIsCreatingNew(true)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                isCreatingNew
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              New Set
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Add to Existing Set */}
          {!isCreatingNew && (
            <div className="space-y-4">
              {sets.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    You don't have any flashcard sets yet.
                  </p>
                  <button
                    onClick={() => setIsCreatingNew(true)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Create your first set →
                  </button>
                </div>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select a set:
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {sets.map((set) => (
                      <button
                        key={set.id}
                        onClick={() => setSelectedSetId(set.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectedSetId === set.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {set.title}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {set.cards?.length || 0} cards
                            </div>
                          </div>
                          {selectedSetId === set.id && (
                            <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Create New Set */}
          {isCreatingNew && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Set Title *
                </label>
                <input
                  type="text"
                  value={newSetTitle}
                  onChange={(e) => setNewSetTitle(e.target.value)}
                  placeholder="e.g., English Vocabulary"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newSetDescription}
                  onChange={(e) => setNewSetDescription(e.target.value)}
                  placeholder="A brief description of this flashcard set..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={
              isCreatingNew ? handleCreateNewSet : handleAddToExistingSet
            }
            disabled={loading || (!isCreatingNew && !selectedSetId)}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>{isCreatingNew ? "Create & Add" : "Add to Set"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToFlashcardModal;
