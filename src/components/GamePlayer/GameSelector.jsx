// src/components/GamePlayer/GameSelector.jsx
import React from 'react';

const GameSelector = ({ games, startGame }) => {
  return (
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
  );
};

export default GameSelector;