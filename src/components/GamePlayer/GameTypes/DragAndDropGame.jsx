import React, { useState, useEffect, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FaVolumeUp, FaClock } from 'react-icons/fa';

const DraggableImage = ({ id, src, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'image',
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`bg-green-500 rounded-lg p-2 cursor-move ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <img src={src} alt={label} className="w-20 h-20 object-cover rounded" />
      <p className="text-center text-sm mt-1 text-white">{label}</p>
    </div>
  );
};

const DroppableStatement = ({ id, statement, onDrop, image, isCorrect }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'image',
    drop: (item) => onDrop(id, item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (image && !isCorrect) {
      setIsFlashing(true);
      const timer = setTimeout(() => setIsFlashing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [image, isCorrect]);

  const getBgColor = () => {
    if (!image) return 'bg-yellow-100';
    if (isCorrect) return 'bg-green-500';
    if (isFlashing) return 'bg-red-500';
    return 'bg-red-300';
  };

  return (
    <div
      ref={drop}
      className={`flex items-center space-x-4 mb-4 p-3 rounded-lg ${getBgColor()} ${
        isOver ? 'border-2 border-blue-500' : ''
      }`}
    >
      <div className="w-16 h-16 border-2 border-dashed border-gray-400 flex items-center justify-center bg-gray-100">
        {image && <img src={image.src} alt={image.label} className="w-full h-full object-cover" />}
      </div>
      <p className={`flex-1 ${image ? 'text-white' : 'text-gray-800'}`}>{statement}</p>
    </div>
  );
};

const DragAndDropGame = ({ currentGame, deductScore, endGame, timeLeft }) => {
    const [droppedImages, setDroppedImages] = useState({});
    const [correctPlacements, setCorrectPlacements] = useState(0);
  
    const checkGameEnd = useCallback(() => {
      if (correctPlacements === currentGame.statements.length) {
        console.log('All placements correct, ending game in 1 second');
        setTimeout(() => {
          console.log('Calling endGame function');
          endGame();
        }, 1000);
      }
    }, [correctPlacements, currentGame.statements.length, endGame]);
  
    useEffect(() => {
      checkGameEnd();
    }, [correctPlacements, checkGameEnd]);
  
    const handleDrop = (statementId, imageId) => {
      const isCorrect = imageId.toString() === statementId.toString();
      console.log(`Drop: Statement ${statementId}, Image ${imageId}, Correct: ${isCorrect}`);
      
      setDroppedImages(prev => ({
        ...prev,
        [statementId]: { id: imageId, isCorrect }
      }));
  
      if (isCorrect) {
        setCorrectPlacements(prev => {
          const newCount = prev + 1;
          console.log('New correctPlacements count:', newCount);
          return newCount;
        });
      } else {
        console.log('Incorrect placement, deducting score');
        deductScore();
      }
    };
  
    return (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <button className="p-2 bg-gray-200 rounded-full">
              <FaVolumeUp />
            </button>
            <div className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-full">
              <FaClock className="mr-2" />
              {timeLeft}s
            </div>
          </div>
          <h2 className="text-xl font-bold mb-4">Drag & Drop la bonne réponse</h2>
          <div className="mb-8 space-y-4">
            {currentGame.statements.map((statement, index) => (
              <DroppableStatement
                key={index}
                id={index}
                statement={statement}
                onDrop={handleDrop}
                image={
                  droppedImages[index]
                    ? {
                        src: currentGame.images[droppedImages[index].id],
                        label: currentGame.imageLabels[droppedImages[index].id],
                      }
                    : null
                }
                isCorrect={droppedImages[index]?.isCorrect}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {currentGame.images.map((image, index) => (
              <DraggableImage
                key={index}
                id={index}
                src={image}
                label={currentGame.imageLabels[index]}
              />
            ))}
          </div>
        </div>
      );
    };
    
    export default DragAndDropGame;