// src/components/GamePlayer.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DraggableImage = ({ id, src, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'image',
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}>
      <img src={src} alt={label} className="w-20 h-20 object-cover" />
      <p className="text-center text-sm mt-1">{label}</p>
    </div>
  );
};

const DroppableStatement = ({ id, statement, onDrop, image, isFlashing, flashColor }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'image',
    drop: (item) => onDrop(id, item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div className="flex items-center space-x-4 mb-4">
      <div
        ref={drop}
        className={`w-24 h-24 border-2 ${
          isOver ? 'border-blue-500' : 'border-gray-300'
        } ${isFlashing ? flashColor : ''} border-dashed flex items-center justify-center transition-colors duration-300`}
      >
        {image ? (
          <img src={image.src} alt={image.label} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400">Drop here</span>
        )}
      </div>
      <p>{statement}</p>
    </div>
  );
};

const GamePlayer = () => {
  const [games, setGames] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [droppedImages, setDroppedImages] = useState({});
  const [flashingStates, setFlashingStates] = useState({});

  useEffect(() => {
    const fetchGames = async () => {
      const querySnapshot = await getDocs(collection(db, 'games'));
      const gamesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGames(gamesData);
    };

    fetchGames();
  }, []);

  useEffect(() => {
    let timer;
    if (currentGame && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && currentGame) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, currentGame]);

  const startGame = (game) => {
    setCurrentGame(game);
    setScore(game.maxScore);
    setGameOver(false);
    setTimeLeft(game.timePerRound);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setDroppedImages({});
    setFlashingStates({});
  };

  const handleAnswer = () => {
    if (!currentGame) {
      console.error('No current game when handling answer');
      return;
    }

    const isCorrect = selectedAnswer.toLowerCase() === currentGame.answers[currentQuestionIndex].toLowerCase();
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    } else {
      setScore(prevScore => Math.max(0, prevScore - currentGame.scoreDeduction));
    }

    if (currentQuestionIndex < currentGame.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer('');
    } else {
      endGame();
    }
  };

  const handleDrop = (statementId, imageId) => {
    setDroppedImages(prev => ({ ...prev, [statementId]: imageId }));
    
    const isCorrect = imageId === statementId;
    
    setFlashingStates(prev => ({
      ...prev,
      [statementId]: {
        isFlashing: true,
        flashColor: isCorrect ? 'bg-green-300' : 'bg-red-300'
      }
    }));

    setTimeout(() => {
      setFlashingStates(prev => ({
        ...prev,
        [statementId]: { isFlashing: false, flashColor: '' }
      }));
    }, 500);

    if (!isCorrect) {
      setScore(prevScore => Math.max(0, prevScore - currentGame.scoreDeduction));
    }

    if (Object.keys(droppedImages).length === currentGame.statements.length - 1) {
      endGame();
    }
  };

  const endGame = () => {
    setGameOver(true);
  };

  if (!gameStarted) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Enter your name to start:</h2>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
          placeholder="Your name"
        />
        <button
          onClick={() => setGameStarted(true)}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          disabled={!playerName}
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl">
        {!currentGame ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Select a game to play:</h2>
            {games.map(game => (
              <button
                key={game.id}
                onClick={() => startGame(game)}
                className="w-full mb-2 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                {game.name}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold">{playerName}</span>
              <span className="font-bold">Score: {score}</span>
              <span className="font-bold">Time: {timeLeft}s</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">{currentGame.name}</h2>
            {!gameOver ? (
              <div>
                {currentGame.type === 'dnd' && (
                  <div>
                    <div className="mb-8">
                      {currentGame.statements.map((statement, index) => (
                        <DroppableStatement
                          key={index}
                          id={index}
                          statement={statement}
                          onDrop={handleDrop}
                          image={droppedImages[index] !== undefined ? {
                            src: currentGame.images[droppedImages[index]],
                            label: currentGame.imageLabels[droppedImages[index]]
                          } : null}
                          isFlashing={flashingStates[index]?.isFlashing}
                          flashColor={flashingStates[index]?.flashColor}
                        />
                      ))}
                    </div>
                    <div className="flex justify-around">
                      {currentGame.images.map((image, index) => (
                        <DraggableImage
                          key={index}
                          id={index}
                          src={image}
                          label={currentGame.imageLabels[index]}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {(currentGame.type === 'simple' || currentGame.type === 'rightAnswer') && (
                  <div>
                    {currentGame.type === 'rightAnswer' && currentGame.images && currentGame.images[currentQuestionIndex] && (
                      <div className="mb-4">
                        <img 
                          src={currentGame.images[currentQuestionIndex]} 
                          alt={`Question ${currentQuestionIndex + 1}`}
                          className="w-full h-auto object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <p className="mb-4">{currentGame.questions[currentQuestionIndex]}</p>
                    {currentGame.type === 'rightAnswer' && currentGame.options && (
                      <div className="space-y-2">
                        {currentGame.options[currentQuestionIndex].split(',').map((option, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedAnswer(option.trim())}
                            className={`w-full px-4 py-2 text-left ${
                              selectedAnswer === option.trim() ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            } rounded-md`}
                          >
                            {option.trim()}
                          </button>
                        ))}
                      </div>
                    )}
                    {currentGame.type === 'simple' && (
                      <input
                        type="text"
                        value={selectedAnswer}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
                        placeholder="Your answer"
                      />
                    )}
                    <button
                      onClick={handleAnswer}
                      className="w-full px-4 py-2 mt-4 text-white bg-green-500 rounded-md hover:bg-green-600"
                    >
                      Submit Answer
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="mb-4">Game Over! Your final score: {score}</p>
                <button
                  onClick={() => {
                    setCurrentGame(null);
                    setGameStarted(false);
                    setGameOver(false);
                    setCurrentQuestionIndex(0);
                    setScore(0);
                  }}
                  className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Play Another Game
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default GamePlayer;