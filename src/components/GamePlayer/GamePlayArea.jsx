// src/components/GamePlayer/GamePlayArea.jsx
import React, { useState, useEffect } from 'react';
import SimpleGame from './GameTypes/SimpleGame';
import DragAndDropGame from './GameTypes/DragAndDropGame';
import RightAnswerGame from './GameTypes/RightAnswerGame';
import ScoreBar from './ScoreBar';

const GamePlayArea = ({
  playerName,
  currentGame,
  timeLeft,
  setCurrentGame,
  setGameStarted
}) => {
  const [score, setScore] = useState(currentGame.maxScore);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setScore(currentGame.maxScore);
    setGameOver(false);
  }, [currentGame]);

  const deductScore = () => {
    setScore(prevScore => Math.max(0, prevScore - currentGame.scoreDeduction));
  };

  const endGame = () => {
    setGameOver(true);
  };

  const renderGame = () => {
    switch (currentGame.type) {
      case 'simple':
        return (
          <SimpleGame
            currentGame={currentGame}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            deductScore={deductScore}
            endGame={endGame}
          />
        );
      case 'dnd':
        return (
          <DragAndDropGame
            currentGame={currentGame}
            deductScore={deductScore}
            endGame={endGame}
            timeLeft={timeLeft}
          />
        );
      case 'rightAnswer':
        return (
          <RightAnswerGame
            currentGame={currentGame}
            score={score}
            setScore={setScore}
            endGame={endGame}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold">{playerName}</span>
        <span className="font-bold">Time: {timeLeft}s</span>
      </div>
      <ScoreBar score={score} maxScore={currentGame.maxScore} />
      <h2 className="text-2xl font-bold mb-4">{currentGame.name}</h2>
      {!gameOver ? (
        renderGame()
      ) : (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Game Over!</h3>
          <p className="mb-4">Your final score: {Math.round(score)}/{currentGame.maxScore}</p>
          <button
            onClick={() => {
              setCurrentGame(null);
              setGameStarted(false);
            }}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Play Another Game
          </button>
        </div>
      )}
    </div>
  );
};

export default GamePlayArea;