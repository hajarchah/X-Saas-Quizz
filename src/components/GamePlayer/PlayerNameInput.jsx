// src/components/GamePlayer/PlayerNameInput.jsx
import React from 'react';

const PlayerNameInput = ({ playerName, setPlayerName, setGameStarted }) => {
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
};

export default PlayerNameInput;