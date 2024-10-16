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

const GamePlayer = () => {
  const [games, setGames] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

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
      // Handle game over
    }
    return () => clearTimeout(timer);
  }, [timeLeft, currentGame]);

  const startGame = (game) => {
    setCurrentGame(game);
    setTimeLeft(game.timePerRound);
    setGameStarted(true);
  };


  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const backend = isMobile ? TouchBackend : HTML5Backend;

  if (!gameStarted) {
    return <PlayerNameInput playerName={playerName} setPlayerName={setPlayerName} setGameStarted={setGameStarted} />;
  }

  return (
    <DndProvider backend={backend}>
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