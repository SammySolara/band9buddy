// src/contexts/DraftContext.js
import { createContext, useContext, useState, useCallback } from "react";

const DraftContext = createContext({});

export const useDrafts = () => {
  const context = useContext(DraftContext);
  if (!context) {
    throw new Error("useDrafts must be used within DraftProvider");
  }
  return context;
};

export const DraftProvider = ({ children }) => {
  // Store drafts in memory: { setId: { title, description, color, cards, lastSaved } }
  const [drafts, setDrafts] = useState({});

  const saveDraft = useCallback((setId, draftData) => {
    setDrafts((prev) => ({
      ...prev,
      [setId]: {
        ...draftData,
        lastSaved: new Date().toISOString(),
      },
    }));
  }, []);

  const getDraft = useCallback(
    (setId) => {
      return drafts[setId] || null;
    },
    [drafts]
  );

  const clearDraft = useCallback((setId) => {
    setDrafts((prev) => {
      const newDrafts = { ...prev };
      delete newDrafts[setId];
      return newDrafts;
    });
  }, []);

  const hasDraft = useCallback(
    (setId) => {
      return !!drafts[setId];
    },
    [drafts]
  );

  const value = {
    saveDraft,
    getDraft,
    clearDraft,
    hasDraft,
  };

  return (
    <DraftContext.Provider value={value}>{children}</DraftContext.Provider>
  );
};
