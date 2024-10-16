// src/components/GameCreator/GameSettings.jsx
import React from 'react';

const GameSettings = ({ gameData, setGameData }) => {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">Step 3: Game Settings</h2>
      <div>
        <label htmlFor="maxScore" className="block text-sm font-medium text-gray-700">Max Score (minimum 3)</label>
        <input
          id="maxScore"
          type="number"
          min="3"
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
          value={gameData.maxScore}
          onChange={(e) => setGameData({...gameData, maxScore: Math.max(3, parseInt(e.target.value) || 3)})}
          placeholder="Enter max score"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="scoreDeduction" className="block text-sm font-medium text-gray-700">Score Deduction for Wrong Answer</label>
        <input
          id="scoreDeduction"
          type="number"
          min="1"
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
          value={gameData.scoreDeduction}
          onChange={(e) => setGameData({...gameData, scoreDeduction: Math.max(1, parseInt(e.target.value) || 1)})}
          placeholder="Enter score deduction"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="timePerRound" className="block text-sm font-medium text-gray-700">Time per Round (seconds)</label>
        <input
          id="timePerRound"
          type="number"
          min="1"
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
          value={gameData.timePerRound}
          onChange={(e) => setGameData({...gameData, timePerRound: Math.max(1, parseInt(e.target.value) || 1)})}
          placeholder="Enter time per round"
        />
      </div>
    </>
  );
};

export default GameSettings;