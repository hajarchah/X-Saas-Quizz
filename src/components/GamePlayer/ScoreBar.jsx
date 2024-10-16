// src/components/GamePlayer/ScoreBar.jsx
import React, { useEffect, useState } from 'react';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

const ScoreBar = ({ score, maxScore }) => {
  const [healthIconUrl, setHealthIconUrl] = useState('');
  const percentage = (score / maxScore) * 100;
  
  useEffect(() => {
    const fetchHealthIcon = async () => {
      const storage = getStorage();
      const healthIconRef = ref(storage, 'gs://x-saas-4550f.appspot.com/Vector (3).png');
      try {
        const url = await getDownloadURL(healthIconRef);
        setHealthIconUrl(url);
      } catch (error) {
        console.error("Error fetching health icon:", error);
      }
    };

    fetchHealthIcon();
  }, []);

  const getColor = () => {
    if (percentage > 60) return 'bg-green-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className={`h-2.5 rounded-full transition-all duration-500 ease-out ${getColor()}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex items-center">
        {healthIconUrl && <img src={healthIconUrl} alt="Health" className="w-6 h-6 mr-1" />}
        <span className="font-bold">{Math.round(score)}</span>
      </div>
    </div>
  );
};

export default ScoreBar;