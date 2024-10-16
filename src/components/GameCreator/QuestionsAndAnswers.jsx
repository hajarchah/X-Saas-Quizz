// src/components/GameCreator/QuestionsAndAnswers.jsx
import React, { useEffect } from "react";

const QuestionsAndAnswers = ({ gameData, setGameData }) => {
  /*   const addItem = () => {
    if (gameData.type === 'rightAnswer') return; // Prevent adding more questions in right answer mode
    if (gameData.questions[gameData.questions.length - 1].trim() === '' ||
        gameData.answers[gameData.answers.length - 1].trim() === '') return; // Prevent adding empty questions/answers

    setGameData(prevData => ({
      ...prevData,
      questions: [...prevData.questions, ''],
      answers: [...prevData.answers, ''],
      statements: [...prevData.statements, ''],
      images: [...prevData.images, ''],
      imageLabels: [...prevData.imageLabels, ''],
      options: [...prevData.options, ''],
    }));
  }; */

  useEffect(() => {
    console.log("gameData updated:", gameData);
  }, [gameData]);

  const addItem = () => {
    console.log("addItem called");
    setGameData((prevData) => {
      console.log("Previous gameData:", prevData);
      
      // Always add a new pair
      const newData = {
        ...prevData,
        statements: [...prevData.statements, ''],
        answers: [...prevData.answers, ''],
        questions: [...prevData.questions, ''],
        images: [...prevData.images, ''],
        imageLabels: [...prevData.imageLabels, ''],
        options: [...prevData.options, '']
      };
      
      console.log("New gameData:", newData);
      return newData;
    });
  };

  const updateField = (index, field, value) => {
    setGameData((prevData) => {
      const newData = { ...prevData };
      newData[field][index] = value;
      return newData;
    });
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Step 2: Questions and Answers</h2>
      {gameData.type === "connect" && (
        <div>
          <p>Number of statements: {gameData.statements.length}</p>
          {gameData.statements.map((statement, index) => (
            <div key={index} className="space-y-2 p-4 border border-gray-300 rounded-md mb-4">
              <p>Rendering statement {index + 1}</p>
              <div>
                <label htmlFor={`statement${index}`} className="block text-sm font-medium text-gray-700">
                  Statement {index + 1}
                </label>
                <input
                  id={`statement${index}`}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                  value={statement}
                  onChange={(e) => updateField(index, "statements", e.target.value)}
                  placeholder={`Enter statement ${index + 1}`}
                />
              </div>
              <div>
                <label htmlFor={`answer${index}`} className="block text-sm font-medium text-gray-700">
                  Answer {index + 1}
                </label>
                <input
                  id={`answer${index}`}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                  value={gameData.answers[index] || ''}
                  onChange={(e) => updateField(index, "answers", e.target.value)}
                  placeholder={`Enter answer ${index + 1}`}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              console.log("Add button clicked");
              addItem();
            }}
            className="mt-4 px-3 py-1 text-sm text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            + Add Statement-Answer Pair
          </button>
        </div>
      )}
      {gameData.type === "simple" &&
        gameData.questions.map((question, index) => (
          <div
            key={index}
            className="space-y-2 p-4 border border-gray-300 rounded-md mb-4"
          >
            <div>
              <label
                htmlFor={`question${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Question {index + 1}
              </label>
              <input
                id={`question${index}`}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                value={question}
                onChange={(e) =>
                  updateField(index, "questions", e.target.value)
                }
                placeholder={`Enter question ${index + 1}`}
              />
            </div>
            <div>
              <label
                htmlFor={`answer${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Answer {index + 1}
              </label>
              <input
                id={`answer${index}`}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                value={gameData.answers[index]}
                onChange={(e) => updateField(index, "answers", e.target.value)}
                placeholder={`Enter answer ${index + 1}`}
              />
            </div>
          </div>
        ))}
      {gameData.type === "dnd" &&
        gameData.statements.map((statement, index) => (
          <div
            key={index}
            className="space-y-2 p-4 border border-gray-300 rounded-md mb-4"
          >
            <div>
              <label
                htmlFor={`statement${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Statement {index + 1}
              </label>
              <input
                id={`statement${index}`}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                value={statement}
                onChange={(e) =>
                  updateField(index, "statements", e.target.value)
                }
                placeholder={`Enter statement ${index + 1}`}
              />
            </div>
            <div>
              <label
                htmlFor={`image${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Image URL {index + 1}
              </label>
              <input
                id={`image${index}`}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                value={gameData.images[index]}
                onChange={(e) => updateField(index, "images", e.target.value)}
                placeholder={`Enter image URL ${index + 1}`}
              />
            </div>
            <div>
              <label
                htmlFor={`imageLabel${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Image Label {index + 1}
              </label>
              <input
                id={`imageLabel${index}`}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                value={gameData.imageLabels[index]}
                onChange={(e) =>
                  updateField(index, "imageLabels", e.target.value)
                }
                placeholder={`Enter image label ${index + 1}`}
              />
            </div>
          </div>
        ))}
      {gameData.type === "rightAnswer" && (
        <div className="space-y-2 p-4 border border-gray-300 rounded-md mb-4">
          <div>
            <label
              htmlFor="question"
              className="block text-sm font-medium text-gray-700"
            >
              Question
            </label>
            <input
              id="question"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
              value={gameData.questions[0]}
              onChange={(e) => updateField(0, "questions", e.target.value)}
              placeholder="Enter your question"
            />
          </div>
          <div>
            <label
              htmlFor="options"
              className="block text-sm font-medium text-gray-700"
            >
              Options (comma-separated)
            </label>
            <input
              id="options"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
              value={gameData.options[0]}
              onChange={(e) => updateField(0, "options", e.target.value)}
              placeholder="Enter options, separated by commas (e.g., Option1, Option2, Option3)"
            />
          </div>
          <div>
            <label
              htmlFor="correctAnswer"
              className="block text-sm font-medium text-gray-700"
            >
              Correct Answer
            </label>
            <input
              id="correctAnswer"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
              value={gameData.answers[0]}
              onChange={(e) => updateField(0, "answers", e.target.value)}
              placeholder="Enter the correct option"
            />
          </div>
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image URL (optional)
            </label>
            <input
              id="image"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
              value={gameData.images[0]}
              onChange={(e) => updateField(0, "images", e.target.value)}
              placeholder="Enter image URL (optional)"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionsAndAnswers;
