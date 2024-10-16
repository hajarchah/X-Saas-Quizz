// src/components/GamePlayer/GameTypes/RightAnswerGame.jsx
import React, { useState } from 'react';

const RightAnswerGame = ({
  currentGame,
  score,
  setScore,
  endGame
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answered, setAnswered] = useState(false);

  const handleAnswer = () => {
    if (answered) return;
    
    const isCorrect = selectedAnswer === currentGame.answers[0];
    
    if (isCorrect) {
      setScore(currentGame.maxScore);
    } else {
      setScore(0);
    }

    setAnswered(true);
    setTimeout(endGame, 1000); // End game after 2 seconds to show the result
  };

  const options = currentGame.options[0].split(',').map(option => option.trim());

  return (
    <div>
      {currentGame.images[0] && (
        <div className="mb-4">
          <img 
            src={currentGame.images[0]} 
            alt="Question"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      )}
      <p className="mb-4">{currentGame.questions[0]}</p>
      <div className="space-y-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedAnswer(option)}
            className={`w-full px-4 py-2 text-left ${
              selectedAnswer === option ? 'bg-blue-500 text-white' : 'bg-gray-200'
            } rounded-md`}
            disabled={answered}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        onClick={handleAnswer}
        className="w-full px-4 py-2 mt-4 text-white bg-green-500 rounded-md hover:bg-green-600"
        disabled={!selectedAnswer || answered}
      >
        Submit Answer
      </button>
      {answered && (
        <div className={`mt-4 p-4 rounded-md ${score === currentGame.maxScore ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {score === currentGame.maxScore ? 'Correct!' : 'Incorrect!'}
        </div>
      )}
    </div>
  );
};

export default RightAnswerGame;