import { useState, useEffect } from "react";
import QuickDefineModal from "./QuickDefineModal";

const GlobalDefineWrapper = ({ children }) => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleContextMenu = (e) => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();

      // Only show context menu if text is selected and it's a single word
      if (selectedText && selectedText.split(/\s+/).length === 1) {
        e.preventDefault();

        setSelectedWord(selectedText);
        setModalPosition({ x: e.pageX, y: e.pageY });
        setShowModal(true);
      }
    };

    const handleKeyDown = (e) => {
      // Allow Ctrl+Click or Cmd+Click to trigger define
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText && selectedText.split(/\s+/).length === 1) {
          e.preventDefault();

          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          setSelectedWord(selectedText);
          setModalPosition({
            x: rect.left + window.scrollX,
            y: rect.bottom + window.scrollY,
          });
          setShowModal(true);
        }
      }

      // Close modal on Escape
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }
    };

    const handleClick = (e) => {
      // Close modal if clicking outside
      if (showModal && !e.target.closest(".quick-define-modal")) {
        setShowModal(false);
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClick);
    };
  }, [showModal]);

  return (
    <>
      {children}

      {showModal && selectedWord && (
        <div className="quick-define-modal">
          <QuickDefineModal
            word={selectedWord}
            position={modalPosition}
            onClose={() => setShowModal(false)}
          />
        </div>
      )}
    </>
  );
};

export default GlobalDefineWrapper;
