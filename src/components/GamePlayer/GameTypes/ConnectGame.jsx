import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DraggableStatement = ({ id, content, onDragStart }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'STATEMENT',
    item: () => {
      onDragStart(id);
      return { id };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      id={`statement-${id}`}
      className={`mb-6 p-4 rounded-lg cursor-move ${
        isDragging ? 'opacity-50' : 'bg-green-500 text-white'
      }`}
    >
      {content}
    </div>
  );
};

const DroppableFact = ({ id, content, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'STATEMENT',
    drop: (item) => onDrop(item.id, id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      id={`fact-${id}`}
      className={`mb-6 p-4 rounded-lg ${
        isOver ? 'bg-yellow-300' : 'bg-yellow-200'
      }`}
    >
      {content}
    </div>
  );
};

const ConnectGame = ({ currentGame, setScore, endGame }) => {
    const [statements, setStatements] = useState([]);
    const [facts, setFacts] = useState([]);
    const [connections, setConnections] = useState({});
    const [draggingStatement, setDraggingStatement] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const svgRef = useRef(null);
  
    useEffect(() => {
      setStatements(shuffleArray([...currentGame.statements]));
      setFacts(shuffleArray([...currentGame.answers]));
      setGameStarted(true);
    }, [currentGame]);
  
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };
  
    const handleDragStart = useCallback((statementId) => {
      setDraggingStatement(statementId);
    }, []);
  
    const handleDrop = useCallback((statementId, factId) => {
      setConnections((prev) => {
        const newConnections = { ...prev, [statementId]: factId };
        
        // Check if the game should end
        if (Object.keys(newConnections).length === statements.length) {
          const correctConnections = Object.entries(newConnections).filter(
            ([statementIndex, factIndex]) => 
              currentGame.statements[statementIndex] === statements[statementIndex] && 
              currentGame.answers[factIndex] === facts[factIndex]
          ).length;
          
          const score = Math.round((correctConnections / statements.length) * currentGame.maxScore);
          setScore(score);
          setTimeout(() => endGame(), 1000);
        }
        
        return newConnections;
      });
      setDraggingStatement(null);
    }, [statements, facts, currentGame, setScore, endGame]);
  
    const drawLine = (startX, startY, endX, endY, key) => {
      return <line key={key} x1={startX} y1={startY} x2={endX} y2={endY} stroke="#4CAF50" strokeWidth="2" />;
    };
  
    if (!gameStarted) {
      return <div>Loading game...</div>;
    }
  
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="p-4 relative">
          <h2 className="text-xl font-bold mb-4">{currentGame.name}</h2>
          <p className="mb-4">Faites glisser une ligne d'un énoncé à la bonne réponse</p>
          <div className="flex justify-between relative">
            <svg ref={svgRef} className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {Object.entries(connections).map(([statementId, factId]) => {
                const statementEl = document.getElementById(`statement-${statementId}`);
                const factEl = document.getElementById(`fact-${factId}`);
                if (statementEl && factEl) {
                  const statementRect = statementEl.getBoundingClientRect();
                  const factRect = factEl.getBoundingClientRect();
                  const svgRect = svgRef.current.getBoundingClientRect();
                  return drawLine(
                    statementRect.right - svgRect.left,
                    statementRect.top + statementRect.height / 2 - svgRect.top,
                    factRect.left - svgRect.left,
                    factRect.top + factRect.height / 2 - svgRect.top,
                    `line-${statementId}-${factId}`
                  );
                }
                return null;
              })}
            </svg>
            <div className="w-1/2 pr-4 z-10 space-y-6">
              {statements.map((statement, index) => (
                <DraggableStatement
                  key={`statement-${index}`}
                  id={index}
                  content={statement}
                  onDragStart={handleDragStart}
                />
              ))}
            </div>
            <div className="w-1/2 pl-4 z-10 space-y-6">
              {facts.map((fact, index) => (
                <DroppableFact
                  key={`fact-${index}`}
                  id={index}
                  content={fact}
                  onDrop={handleDrop}
                />
              ))}
            </div>
          </div>
        </div>
      </DndProvider>
    );
  };
  
  export default ConnectGame;