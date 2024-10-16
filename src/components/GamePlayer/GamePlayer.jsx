// src/components/GamePlayer/GamePlayer.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import PlayerNameInput from './PlayerNameInput';
import GameSelector from './GameSelector';
import GamePlayArea from './GamePlayArea';
import GameCountdown from './GameCountdown';

const GamePlayer = () => {
  const [games, setGames] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);

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
    if (currentGame && timeLeft > 0 && gameStarted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && currentGame && gameStarted) {
      // Handle game over
    }
    return () => clearTimeout(timer);
  }, [timeLeft, currentGame, gameStarted]);

  const startGame = (game) => {
    setCurrentGame(game);
    setTimeLeft(game.timePerRound);
    setIsCountingDown(true);
  };

  const handleCountdownEnd = () => {
    setIsCountingDown(false);
    setGameStarted(true);
  };

  // Determine if the device is touch-based
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Choose the appropriate backend
  const backendForDND = isTouchDevice ? TouchBackend : HTML5Backend;

  // Options for touch backend
  const touchBackendOptions = {
    enableMouseEvents: true,
    enableKeyboardEvents: true,
    enableHoverOutsideTarget: true,
  };

  if (!playerName) {
    return <PlayerNameInput setPlayerName={setPlayerName} setGameStarted={setGameStarted} />;
  }

  if (isCountingDown) {
    return <GameCountdown onCountdownEnd={handleCountdownEnd} />;
  }

  return (
    <DndProvider backend={backendForDND} options={isTouchDevice ? touchBackendOptions : undefined}>
      <div className="max-w-md mx-auto">
        {!currentGame ? (
          <GameSelector games={games} startGame={startGame} />
        ) : (
          <GamePlayArea
            playerName={playerName}
            currentGame={currentGame}
            timeLeft={timeLeft}
            setCurrentGame={setCurrentGame}
            setGameStarted={setGameStarted}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default GamePlayer;