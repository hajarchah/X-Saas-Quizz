// src/components/GamePlayer/GameTypes/SimpleGame.jsx
import React, { useState } from 'react';

const SimpleGame = ({
  currentGame,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  deductScore,
  endGame
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const handleAnswer = () => {
    const isCorrect = selectedAnswer.toLowerCase() === currentGame.answers[currentQuestionIndex].toLowerCase();
    
    if (!isCorrect) {
      deductScore();
    }

    if (currentQuestionIndex < currentGame.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer('');
    } else {
      endGame();
    }
  };

  return (
    <div>
      <p className="mb-4">{currentGame.questions[currentQuestionIndex]}</p>
      <input
        type="text"
        value={selectedAnswer}
        onChange={(e) => setSelectedAnswer(e.target.value)}
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
        placeholder="Your answer"
      />
      <button
        onClick={handleAnswer}
        className="w-full px-4 py-2 mt-4 text-white bg-green-500 rounded-md hover:bg-green-600"
      >
        Submit Answer
      </button>
    </div>
  );
};

export default SimpleGame;