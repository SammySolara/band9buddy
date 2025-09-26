import React, { useState } from 'react';

const StudyMode = ({ set }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!set || !set.flashcards || set.flashcards.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold">Bộ thẻ này trống!</h3>
        <p className="text-gray-600">Vui lòng thêm thẻ để bắt đầu học.</p>
      </div>
    );
  }

  const currentCard = set.flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false); // Reset flip state
    setCurrentIndex((prevIndex) => (prevIndex + 1) % set.flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false); // Reset flip state
    setCurrentIndex((prevIndex) => (prevIndex - 1 + set.flashcards.length) % set.flashcards.length);
  };


  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">{set.title}</h2>
      <p className="text-center text-gray-500 mb-6">
        Thẻ {currentIndex + 1} / {set.flashcards.length}
      </p>

      {/* Flashcard */}
      <div 
        className="relative w-full h-64 cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div 
          className={`absolute w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-white rounded-lg shadow-lg border">
            <p className="text-3xl font-semibold text-gray-800">{currentCard.front_text}</p>
          </div>
          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-6 bg-indigo-50 rounded-lg shadow-lg border">
            <p className="text-3xl font-semibold text-indigo-800">{currentCard.back_text}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button onClick={handlePrev} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
          Trước
        </button>
        <button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default StudyMode;