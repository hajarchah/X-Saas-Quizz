// src/components/GameCreator/BasicInfo.jsx
import React from 'react';

const BasicInfo = ({ gameData, setGameData }) => {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">Step 1: Basic Info</h2>
      <div>
        <label htmlFor="gameName" className="block text-sm font-medium text-gray-700">Game Name (required)</label>
        <input
          id="gameName"
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
          value={gameData.name}
          onChange={(e) => setGameData({...gameData, name: e.target.value})}
          placeholder="Enter game name"
          required
        />
      </div>
      <div className="mt-4">
        <label htmlFor="gameType" className="block text-sm font-medium text-gray-700">Game Type</label>
        <select
          id="gameType"
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
          value={gameData.type}
          onChange={(e) => setGameData({...gameData, type: e.target.value})}
        >
          <option value="simple">Simple</option>
          <option value="dnd">Drag and Drop</option>
          <option value="rightAnswer">Right Answer</option>
        </select>
      </div>
    </>
  );
};

export default BasicInfo;