// src/components/GamePlayer/PlayerNameInput.jsx
import React, { useState } from 'react';

const PlayerNameInput = ({ setPlayerName, setGameStarted }) => {
  const [inputName, setInputName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputName.trim()) {
      setPlayerName(inputName);
      setGameStarted(true);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Enter your name to start:</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
          placeholder="Your name"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          disabled={!inputName.trim()}
        >
          Start Game
        </button>
      </form>
    </div>
  );
};

export default PlayerNameInput;