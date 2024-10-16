// src/components/GameCreator/ReviewAndSubmit.jsx
import React from 'react';

const ReviewAndSubmit = ({ gameData }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Step 4: Review and Submit</h2>
      <div className="bg-white p-4 rounded-md shadow">
        <h3 className="font-semibold mb-2">Basic Info</h3>
        <p><strong>Game Name:</strong> {gameData.name}</p>
        <p><strong>Game Type:</strong> {gameData.type}</p>
      </div>
      <div className="bg-white p-4 rounded-md shadow">
        <h3 className="font-semibold mb-2">Questions and Answers</h3>
        {gameData.type === 'simple' && gameData.questions.map((question, index) => (
          <div key={index} className="mb-2">
            <p><strong>Question {index + 1}:</strong> {question}</p>
            <p><strong>Answer:</strong> {gameData.answers[index]}</p>
          </div>
        ))}
        {gameData.type === 'dnd' && gameData.statements.map((statement, index) => (
          <div key={index} className="mb-2">
            <p><strong>Statement {index + 1}:</strong> {statement}</p>
            <p><strong>Image:</strong> {gameData.images[index]}</p>
            <p><strong>Image Label:</strong> {gameData.imageLabels[index]}</p>
          </div>
        ))}
        {gameData.type === 'rightAnswer' && gameData.questions.map((question, index) => (
          <div key={index} className="mb-2">
            <p><strong>Question {index + 1}:</strong> {question}</p>
            <p><strong>Options:</strong> {gameData.options[index]}</p>
            <p><strong>Correct Answer:</strong> {gameData.answers[index]}</p>
            <p><strong>Image:</strong> {gameData.images[index]}</p>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 rounded-md shadow">
        <h3 className="font-semibold mb-2">Game Settings</h3>
        <p><strong>Max Score:</strong> {gameData.maxScore}</p>
        <p><strong>Score Deduction:</strong> {gameData.scoreDeduction}</p>
        <p><strong>Time per Round:</strong> {gameData.timePerRound} seconds</p>
      </div>
    </div>
  );
};

export default ReviewAndSubmit;