// src/components/GameCreator.jsx
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';

const GameCreator = () => {
  const [step, setStep] = useState(1);
  const [gameData, setGameData] = useState({
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

    if (gameData.type === 'rightAnswer') {
      const invalidOptions = gameData.options.some(option => {
        const optionsArray = option.split(',').map(opt => opt.trim());
        return optionsArray.length < 2;
      });

      if (invalidOptions) {
        setError('Right answer games must have at least two options for each question');
        return;
      }
    }

    try {
      await addDoc(collection(db, 'games'), gameData);
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

  const addItem = () => {
    setGameData(prevData => ({
      ...prevData,
      questions: [...prevData.questions, ''],
      answers: [...prevData.answers, ''],
      statements: [...prevData.statements, ''],
      images: [...prevData.images, ''],
      imageLabels: [...prevData.imageLabels, ''],
      options: [...prevData.options, ''],
    }));
  };

  const updateField = (index, field, value) => {
    setGameData(prevData => {
      const newData = { ...prevData };
      newData[field][index] = value;
      return newData;
    });
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
      case 2:
        return (
          <>
            <h2 className="text-xl font-bold mb-4">Step 2: Questions and Answers</h2>
            {gameData.type === 'simple' && gameData.questions.map((question, index) => (
              <div key={index} className="space-y-2 p-4 border border-gray-300 rounded-md mb-4">
                <div>
                  <label htmlFor={`question${index}`} className="block text-sm font-medium text-gray-700">Question {index + 1}</label>
                  <input
                    id={`question${index}`}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                    value={question}
                    onChange={(e) => updateField(index, 'questions', e.target.value)}
                    placeholder={`Enter question ${index + 1}`}
                  />
                </div>
                <div>
                  <label htmlFor={`answer${index}`} className="block text-sm font-medium text-gray-700">Answer {index + 1}</label>
                  <input
                    id={`answer${index}`}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                    value={gameData.answers[index]}
                    onChange={(e) => updateField(index, 'answers', e.target.value)}
                    placeholder={`Enter answer ${index + 1}`}
                  />
                </div>
              </div>
            ))}
            {gameData.type === 'dnd' && gameData.statements.map((statement, index) => (
              <div key={index} className="space-y-2 p-4 border border-gray-300 rounded-md mb-4">
                <div>
                  <label htmlFor={`statement${index}`} className="block text-sm font-medium text-gray-700">Statement {index + 1}</label>
                  <input
                    id={`statement${index}`}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                    value={statement}
                    onChange={(e) => updateField(index, 'statements', e.target.value)}
                    placeholder={`Enter statement ${index + 1}`}
                  />
                </div>
                <div>
                  <label htmlFor={`image${index}`} className="block text-sm font-medium text-gray-700">Image URL {index + 1}</label>
                  <input
                    id={`image${index}`}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                    value={gameData.images[index]}
                    onChange={(e) => updateField(index, 'images', e.target.value)}
                    placeholder={`Enter image URL ${index + 1}`}
                  />
                </div>
                <div>
                  <label htmlFor={`imageLabel${index}`} className="block text-sm font-medium text-gray-700">Image Label {index + 1}</label>
                  <input
                    id={`imageLabel${index}`}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                    value={gameData.imageLabels[index]}
                    onChange={(e) => updateField(index, 'imageLabels', e.target.value)}
                    placeholder={`Enter image label ${index + 1}`}
                  />
                </div>
              </div>
            ))}
            {gameData.type === 'rightAnswer' && gameData.questions.map((question, index) => (
              <div key={index} className="space-y-2 p-4 border border-gray-300 rounded-md mb-4">
                <div>
                  <label htmlFor={`question${index}`} className="block text-sm font-medium text-gray-700">Question {index + 1}</label>
                  <input
                    id={`question${index}`}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                    value={question}
                    onChange={(e) => updateField(index, 'questions', e.target.value)}
                    placeholder={`Enter question ${index + 1}`}
                  />
                </div>
                <div>
                  <label htmlFor={`options${index}`} className="block text-sm font-medium text-gray-700">Options {index + 1} (comma-separated, at least 2)</label>
                  <input
                    id={`options${index}`}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                    value={gameData.options[index]}
                    onChange={(e) => updateField(index, 'options', e.target.value)}
                    placeholder="Enter options, separated by commas (e.g., Option1, Option2, Option3)"
                  />
                </div>
                <div>
                  <label htmlFor={`answer${index}`} className="block text-sm font-medium text-gray-700">Correct Answer {index + 1}</label>
                  <input
                    id={`answer${index}`}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                    value={gameData.answers[index]}
                    onChange={(e) => updateField(index, 'answers', e.target.value)}
                    placeholder={`Enter correct answer ${index + 1}`}
                  />
                </div>
                <div>
                  <label htmlFor={`image${index}`} className="block text-sm font-medium text-gray-700">Image URL {index + 1}</label>
                  <input
                    id={`image${index}`}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                    value={gameData.images[index]}
                    onChange={(e) => updateField(index, 'images', e.target.value)}
                    placeholder={`Enter image URL ${index + 1}`}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 mt-4"
            >
              Add Question
            </button>
          </>
        );
      case 3:
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
      case 4:
        return (
          <>
            <h2 className="text-xl font-bold mb-4">Step 4: Review and Submit</h2>
            <div className="space-y-2">
              <p><strong>Game Name:</strong> {gameData.name}</p>
              <p><strong>Game Type:</strong> {gameData.type}</p>
              <p><strong>Number of Questions:</strong> {gameData.questions.length}</p>
              <p><strong>Max Score:</strong> {gameData.maxScore}</p>
              <p><strong>Score Deduction:</strong> {gameData.scoreDeduction}</p>
              <p><strong>Time per Round:</strong> {gameData.timePerRound} seconds</p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderStep()}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
          >
            Previous
          </button>
        )}
        {step < 4 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
          >
            Create Game
          </button>
        )}
      </div>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {success && <div className="text-green-500 mt-4">Game created successfully!</div>}
    </form>
  );
};

export default GameCreator;