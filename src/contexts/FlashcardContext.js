// src/contexts/FlashcardContext.js
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "./AuthContext";

const FlashcardContext = createContext({});

export const useFlashcards = () => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error("useFlashcards must be used within FlashcardProvider");
  }
  return context;
};

export const FlashcardProvider = ({ children }) => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSet, setCurrentSet] = useState(null);
  const { user } = useAuth();

  // Transform flashcards data to match component expectations
  const transformSet = (set) => {
    if (!set) return set;
    return {
      ...set,
      cards:
        set.flashcards?.map((card) => ({
          id: card.id,
          front: card.front_text,
          back: card.back_text,
          front_image_url: card.front_image_url || "",
          back_image_url: card.back_image_url || "",
          tags: card.tags || [],
          // Keep original fields for database operations
          front_text: card.front_text,
          back_text: card.back_text,
        })) || [],
    };
  };

  // Load user's flashcard sets
  const loadSets = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("flashcard_sets")
        .select(
          `
          *,
          flashcards (*)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform data to include both formats
      const transformedSets = (data || []).map(transformSet);
      setSets(transformedSets);
    } catch (error) {
      console.error("Error loading sets:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create new flashcard set
  const createSet = async (setData) => {
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      // Extract cards from setData if present
      const { cards, ...setInfo } = setData;

      const { data: newSet, error: setError } = await supabase
        .from("flashcard_sets")
        .insert([
          {
            ...setInfo,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (setError) throw setError;

      // If cards were provided, add them
      let flashcardsData = [];
      if (cards && cards.length > 0) {
        const cardsToInsert = cards
          .filter((card) => card.front?.trim() && card.back?.trim())
          .map((card) => ({
            set_id: newSet.id,
            front_text: card.front.trim(),
            back_text: card.back.trim(),
            front_image_url: card.front_image_url || null,
            back_image_url: card.back_image_url || null,
            tags: card.tags || [],
          }));

        if (cardsToInsert.length > 0) {
          const { data: newCards, error: cardsError } = await supabase
            .from("flashcards")
            .insert(cardsToInsert)
            .select();

          if (cardsError) throw cardsError;
          flashcardsData = newCards;
        }
      }

      // Create the complete set object
      const completeSet = transformSet({
        ...newSet,
        flashcards: flashcardsData,
      });

      // Add to local state
      setSets((prev) => [completeSet, ...prev]);
      return { success: true, data: completeSet };
    } catch (error) {
      console.error("Create set error:", error);
      return { success: false, error: error.message };
    }
  };

  // Update flashcard set
  const updateSet = async (setId, updates) => {
    try {
      // Separate cards from other updates
      const { cards, ...setUpdates } = updates;

      // Update set metadata
      const { data: updatedSet, error: setError } = await supabase
        .from("flashcard_sets")
        .update(setUpdates)
        .eq("id", setId)
        .eq("user_id", user.id)
        .select()
        .single();

      if (setError) throw setError;

      // If cards were provided, handle card updates
      if (cards) {
        // Delete existing cards
        await supabase.from("flashcards").delete().eq("set_id", setId);

        // Insert new cards
        let flashcardsData = [];
        const cardsToInsert = cards
          .filter((card) => card.front?.trim() && card.back?.trim())
          .map((card) => ({
            set_id: setId,
            front_text: card.front.trim(),
            back_text: card.back.trim(),
            front_image_url: card.front_image_url || null,
            back_image_url: card.back_image_url || null,
            tags: card.tags || [],
          }));

        if (cardsToInsert.length > 0) {
          const { data: newCards, error: cardsError } = await supabase
            .from("flashcards")
            .insert(cardsToInsert)
            .select();

          if (cardsError) throw cardsError;
          flashcardsData = newCards;
        }

        // Update local state with complete set
        const completeSet = transformSet({
          ...updatedSet,
          flashcards: flashcardsData,
        });

        setSets((prev) =>
          prev.map((set) => (set.id === setId ? completeSet : set))
        );

        return { success: true, data: completeSet };
      } else {
        // Just update metadata, keep existing cards
        setSets((prev) =>
          prev.map((set) =>
            set.id === setId ? { ...set, ...setUpdates } : set
          )
        );
        return { success: true, data: updatedSet };
      }
    } catch (error) {
      console.error("Update set error:", error);
      return { success: false, error: error.message };
    }
  };

  // Delete flashcard set
  const deleteSet = async (setId) => {
    try {
      const { error } = await supabase
        .from("flashcard_sets")
        .delete()
        .eq("id", setId)
        .eq("user_id", user.id);

      if (error) throw error;

      // Remove from local state
      setSets((prev) => prev.filter((set) => set.id !== setId));
      if (currentSet?.id === setId) {
        setCurrentSet(null);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Add flashcard to set
  const addCard = async (setId, cardData) => {
    try {
      const { data, error } = await supabase
        .from("flashcards")
        .insert([
          {
            set_id: setId,
            front_text: cardData.front_text || cardData.front,
            back_text: cardData.back_text || cardData.back,
            front_image_url: cardData.front_image_url || null,
            back_image_url: cardData.back_image_url || null,
            tags: cardData.tags || [],
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setSets((prev) =>
        prev.map((set) =>
          set.id === setId
            ? {
                ...set,
                flashcards: [...(set.flashcards || []), data],
                cards: [
                  ...(set.cards || []),
                  {
                    id: data.id,
                    front: data.front_text,
                    back: data.back_text,
                    front_image_url: data.front_image_url || "",
                    back_image_url: data.back_image_url || "",
                    tags: data.tags || [],
                    front_text: data.front_text,
                    back_text: data.back_text,
                  },
                ],
              }
            : set
        )
      );

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Update flashcard
  const updateCard = async (cardId, updates) => {
    try {
      const { data, error } = await supabase
        .from("flashcards")
        .update({
          front_text: updates.front_text || updates.front,
          back_text: updates.back_text || updates.back,
          front_image_url: updates.front_image_url || null,
          back_image_url: updates.back_image_url || null,
          tags: updates.tags || [],
        })
        .eq("id", cardId)
        .select()
        .single();

      if (error) throw error;

      setSets((prev) =>
        prev.map((set) => ({
          ...set,
          flashcards: set.flashcards?.map((card) =>
            card.id === cardId ? { ...card, ...data } : card
          ),
          cards: set.cards?.map((card) =>
            card.id === cardId
              ? {
                  ...card,
                  front: data.front_text,
                  back: data.back_text,
                  front_image_url: data.front_image_url || "",
                  back_image_url: data.back_image_url || "",
                  tags: data.tags || [],
                  front_text: data.front_text,
                  back_text: data.back_text,
                }
              : card
          ),
        }))
      );

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Delete flashcard
  const deleteCard = async (cardId) => {
    try {
      const { error } = await supabase
        .from("flashcards")
        .delete()
        .eq("id", cardId);

      if (error) throw error;

      // Remove from local state
      setSets((prev) =>
        prev.map((set) => ({
          ...set,
          flashcards: set.flashcards?.filter((card) => card.id !== cardId),
          cards: set.cards?.filter((card) => card.id !== cardId),
        }))
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Load sets when user changes
  useEffect(() => {
    if (user) {
      loadSets();
    } else {
      setSets([]);
      setCurrentSet(null);
    }
  }, [user, loadSets]);

  const value = {
    sets,
    loading,
    currentSet,
    setCurrentSet,
    createSet,
    updateSet,
    deleteSet,
    addCard,
    updateCard,
    deleteCard,
    loadSets,
  };

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
};
