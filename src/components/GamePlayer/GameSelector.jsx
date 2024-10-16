// src/components/GamePlayer/GameSelector.jsx
import React, { useState, useMemo } from 'react';

const GameSelector = ({ games, startGame }) => {
  const [selectedType, setSelectedType] = useState('all');

  const gameTypes = useMemo(() => {
    const types = new Set(games.map(game => game.type).filter(Boolean));
    return ['all', ...Array.from(types)];
  }, [games]);

  const filteredGames = useMemo(() => {
    if (selectedType === 'all') {
      return games;
    }
    return games.filter(game => game.type === selectedType);
  }, [games, selectedType]);

  const capitalizeFirstLetter = (string) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Select a game to play:</h2>
      
      <div className="mb-4">
        <label htmlFor="gameType" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by game type:
        </label>
        <select
          id="gameType"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {gameTypes.map((type) => (
            <option key={type} value={type}>
              {capitalizeFirstLetter(type)}
            </option>
          ))}
        </select>
      </div>
      
      {filteredGames.length === 0 ? (
        <p className="text-gray-500">No games available for the selected type.</p>
      ) : (
        filteredGames.map(game => (
          <button
            key={game.id}
            onClick={() => startGame(game)}
            className="w-full mb-2 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 flex justify-between items-center"
          >
            <span>{game.name}</span>
            <span className="text-sm bg-blue-600 px-2 py-1 rounded">
              {capitalizeFirstLetter(game.type)}
            </span>
          </button>
        ))
      )}
    </div>
  );
};

export default GameSelector;