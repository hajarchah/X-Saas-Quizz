// src/components/GameCreator/GameCreator.jsx
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase.config";
import BasicInfo from "./BasicInfo";
import QuestionsAndAnswers from "./QuestionsAndAnswers";
import GameSettings from "./GameSettings";
import ReviewAndSubmit from "./ReviewAndSubmit";

const GameCreator = () => {
  const [step, setStep] = useState(1);
  const [gameData, setGameData] = useState({
    name: "",
    type: "simple",
    questions: [""],
    answers: [""],
    statements: [""],
    images: [""],
    imageLabels: [""],
    options: [""],
    maxScore: 10,
    scoreDeduction: 1,
    timePerRound: 60,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
  
    if (!gameData.name.trim()) {
      setError('Game name is required');
      return;
    }
  
    const cleanedGameData = {
      ...gameData,
      statements: gameData.statements.filter(s => s.trim() !== ''),
      answers: gameData.answers.filter(a => a.trim() !== '')
    };
  
    if (cleanedGameData.type === 'connect') {
      if (cleanedGameData.statements.length === 0 || cleanedGameData.answers.length === 0) {
        setError('At least one statement-answer pair is required');
        return;
      }
      if (cleanedGameData.statements.length !== cleanedGameData.answers.length) {
        setError('Each statement must have a corresponding answer');
        return;
      }
    }
  
    try {
      await addDoc(collection(db, 'games'), cleanedGameData);
      setSuccess(true);
      setGameData({
        name: '',
        type: 'simple',
        questions: [''],
        answers: [''],
        statements: [''],
        images: [''],
        imageLabels: [''],
        options: [''],
        maxScore: 10,
        scoreDeduction: 1,
        timePerRound: 60,
      });
      setStep(1);
    } catch (error) {
      console.error('Error creating game:', error);
      setError(error.message);
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <BasicInfo gameData={gameData} setGameData={setGameData} />;
      case 2:
        return (
          <QuestionsAndAnswers gameData={gameData} setGameData={setGameData} />
        );
      case 3:
        return <GameSettings gameData={gameData} setGameData={setGameData} />;
      case 4:
        return <ReviewAndSubmit gameData={gameData} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {renderStep()}
      <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-2 sm:space-y-0">
        {step > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 w-full sm:w-auto"
          >
            Previous
          </button>
        )}
        {step < 4 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 w-full sm:w-auto"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 w-full sm:w-auto"
          >
            Create Game
          </button>
        )}
      </div>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {success && (
        <div className="text-green-500 mt-4">Game created successfully!</div>
      )}
    </div>
  );
};

export default GameCreator;
