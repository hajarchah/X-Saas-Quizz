// src/components/GamePlayer/GameCountdown.jsx
import React, { useState, useEffect } from 'react';

const GameCountdown = ({ onCountdownEnd }) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onCountdownEnd();
    }
  }, [countdown, onCountdownEnd]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h2 className="text-4xl font-bold mb-4">Get Ready!</h2>
      <p className="text-6xl font-bold">{countdown}</p>
    </div>
  );
};

export default GameCountdown;