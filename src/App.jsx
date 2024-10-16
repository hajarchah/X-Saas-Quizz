// src/App.jsx
import React, { useEffect, useState } from 'react';
import GameCreator from './components/GameCreator/GameCreator';
import GamePlayer from './components/GamePlayer/GamePlayer';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

function App() {
  const [activeComponent, setActiveComponent] = useState('create');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      const storage = getStorage();
      const backgroundImageRef = ref(storage, 'gs://x-saas-4550f.appspot.com/Rectangle 63.png');
      try {
        const url = await getDownloadURL(backgroundImageRef);
        setBackgroundImageUrl(url);
      } catch (error) {
        console.error("Error fetching background image:", error);
      }
    };

    fetchBackgroundImage();
  }, []);

  return (
    <div style={{
      backgroundImage: `url(${backgroundImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
    }} className="min-h-screen py-3 flex flex-col justify-center sm:py-6 text-black">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0">
        <link href="https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&display=swap" rel="stylesheet" />
        <div className="relative px-4 py-5 bg-gray-100 shadow-lg sm:rounded-3xl sm:p-10">
          <h1 className="text-2xl font-semibold mb-6 text-center">X-Saas Game Platform</h1>
          <div className="mb-6 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setActiveComponent('create')}
              className={`px-4 py-2 rounded-md ${activeComponent === 'create' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Create Game
            </button>
            <button
              onClick={() => setActiveComponent('play')}
              className={`px-4 py-2 rounded-md ${activeComponent === 'play' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Play Game
            </button>
          </div>
          {activeComponent === 'create' ? <GameCreator /> : <GamePlayer />}
        </div>
      </div>
    </div>
  );
}

export default App;