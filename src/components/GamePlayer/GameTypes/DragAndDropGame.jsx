import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FaVolumeUp, FaClock } from 'react-icons/fa';

const DraggableImage = ({ id, src, label, isFlashing }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'image',
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    preview(new Image(), { captureDraggingState: true })
  }, [preview]);

  return (
    <div
      ref={drag}
      className={`bg-green-500 rounded-lg p-2 cursor-move ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${isFlashing ? 'animate-flash bg-red-500' : ''}`}
    >
      <img src={src} alt={label} className="w-20 h-20 object-cover rounded" />
      <p className="text-center text-sm mt-1 text-white">{label}</p>
    </div>
  );
};

const DroppableStatement = ({ id, statement, onDrop, image }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'image',
    drop: (item) => onDrop(id, item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`flex items-center space-x-4 mb-4 p-3 rounded-lg ${
        image ? 'bg-green-500' : 'bg-yellow-100'
      } ${isOver ? 'border-2 border-blue-500' : ''}`}
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
  const [incorrectPlacements, setIncorrectPlacements] = useState({});
  const [correctPlacements, setCorrectPlacements] = useState(0);

  useEffect(() => {
    if (correctPlacements === currentGame.statements.length) {
      endGame();
    }
  }, [correctPlacements, currentGame.statements.length, endGame]);

  const handleDrop = (statementId, imageId) => {
    const isCorrect = imageId.toString() === statementId.toString();
    
    if (isCorrect) {
      setDroppedImages(prev => ({
        ...prev,
        [statementId]: { id: imageId, src: currentGame.images[imageId], label: currentGame.imageLabels[imageId] }
      }));
      setCorrectPlacements(prev => prev + 1);
    } else {
      setIncorrectPlacements(prev => ({ ...prev, [imageId]: true }));
      deductScore();
      setTimeout(() => {
        setIncorrectPlacements(prev => ({ ...prev, [imageId]: false }));
      }, 1000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto">
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
      <div className="mb-8">
        {currentGame.statements.map((statement, index) => (
          <DroppableStatement
            key={index}
            id={index}
            statement={statement}
            onDrop={handleDrop}
            image={droppedImages[index]}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {currentGame.images.map((image, index) => (
          <DraggableImage
            key={index}
            id={index}
            src={image}
            label={currentGame.imageLabels[index]}
            isFlashing={incorrectPlacements[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default DragAndDropGame;