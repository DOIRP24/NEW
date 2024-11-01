import React, { useState, useEffect } from 'react';
import { Brain, Award, Trophy, Circle } from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import { incrementPoints } from '../services/storage';
import { useUser } from '../contexts/UserContext';
import UserWidget from '../components/UserWidget';

const LEVELS = [
  { name: 'Новичок', points: 0, icon: '🎓' },
  { name: 'Студент', points: 50, icon: '📚' },
  { name: 'Практикант', points: 150, icon: '💼' },
  { name: 'Специалист', points: 300, icon: '⭐' },
  { name: 'Эксперт', points: 500, icon: '🏆' },
  { name: 'Мастер', points: 1000, icon: '👑' },
  { name: 'Легенда', points: 2000, icon: '🌟' }
];

interface FlyingImage {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

const Training = () => {
  const { userData, isLoading, error } = useUser();
  const [clickPower] = useState(1);
  const [isClicking, setIsClicking] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(LEVELS[0]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [flyingImages, setFlyingImages] = useState<FlyingImage[]>([]);
  const [lastClickTime, setLastClickTime] = useState(0);

  useEffect(() => {
    if (userData?.points !== undefined) {
      updateLevel(userData.points);
    }
  }, [userData?.points]);

  const getNextLevel = () => {
    const nextLevel = LEVELS.find(level => level.points > (userData?.points || 0));
    return nextLevel || LEVELS[LEVELS.length - 1];
  };

  const getProgressToNextLevel = () => {
    const nextLevel = getNextLevel();
    const currentLevelPoints = currentLevel.points;
    const pointsToNext = nextLevel.points - currentLevelPoints;
    const progress = (((userData?.points || 0) - currentLevelPoints) / pointsToNext) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const updateLevel = (points: number) => {
    const newLevel = LEVELS.reduce((acc, level) => {
      if (points >= level.points) return level;
      return acc;
    }, LEVELS[0]);

    if (newLevel.name !== currentLevel.name) {
      setCurrentLevel(newLevel);
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  };

  const createFlyingImage = (x: number, y: number) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 2;
    const rotation = Math.random() * 360;
    const scale = 0.4 + Math.random() * 0.3;
    
    const image: FlyingImage = {
      id: Date.now() + Math.random(),
      x,
      y,
      rotation,
      scale,
      opacity: 1
    };

    setFlyingImages(prev => [...prev, image]);

    const startTime = Date.now();
    const duration = 800;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        setFlyingImages(prev => prev.filter(img => img.id !== image.id));
        return;
      }

      setFlyingImages(prev => prev.map(img => {
        if (img.id === image.id) {
          const fadeStart = 0.3;
          const opacity = progress < fadeStart ? 1 : 1 - ((progress - fadeStart) / (1 - fadeStart));
          const scale = 1 - progress * 0.8;
          
          return {
            ...img,
            x: x + Math.cos(angle) * speed * elapsed * 0.3,
            y: y + Math.sin(angle) * speed * elapsed * 0.3 - (elapsed * 0.4),
            opacity,
            scale: img.scale * scale
          };
        }
        return img;
      }));

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!userData) return;

    const now = Date.now();
    if (now - lastClickTime < 100) return; // Prevent rapid clicking
    setLastClickTime(now);

    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 3; i++) {
      createFlyingImage(centerX, centerY);
    }
    
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 100);

    const user = WebApp.initDataUnsafe?.user;
    if (user) {
      try {
        await incrementPoints(user.id, clickPower);
      } catch (error) {
        console.error('Error updating points:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-gray-900 to-emerald-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-gray-900 to-emerald-950 flex items-center justify-center">
        <div className="text-emerald-400 text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-gray-900 to-emerald-950">
      <div className="relative">
        {showLevelUp && (
          <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-emerald-600/90 text-white px-6 py-3 rounded-full z-50 animate-bounce flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Новый уровень: {currentLevel.name}!
          </div>
        )}

        <div className="p-4">
          <UserWidget />
        </div>

        <div className="p-4 bg-emerald-900/20 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white flex items-center">
              <Brain className="w-5 h-5 mr-2 text-emerald-400" />
              Прокачка
            </h1>
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-black/40 rounded-full px-3 py-1">
                <span className="text-emerald-400 mr-1">{currentLevel.icon}</span>
                <span className="text-white text-sm">{currentLevel.name}</span>
              </div>
              <div className="flex items-center bg-black/40 rounded-full px-3 py-1">
                <Award className="w-4 h-4 mr-1 text-emerald-400" />
                <span className="text-white text-sm">{userData?.points || 0}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between text-xs text-emerald-400 mb-1">
              <span>{(userData?.points || 0) - currentLevel.points}</span>
              <span>{getNextLevel().points - currentLevel.points}</span>
            </div>
            <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${getProgressToNextLevel()}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-6">
          <button
            id="clickTarget"
            onClick={handleClick}
            className={`transform transition-all duration-100 ${
              isClicking ? 'scale-95' : 'scale-100 hover:scale-105'
            }`}
          >
            <img
              src="https://static.tildacdn.com/tild3838-3837-4131-b836-333837326233/___1.png"
              alt="Click to train"
              className="w-[410px] h-[410px] object-contain relative z-10"
            />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-emerald-900/10 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-white mb-3">Задачи</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-emerald-900/20">
                <Circle className="w-5 h-5 text-emerald-400" />
                <span className="text-white">Посети все сессии</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-emerald-900/20">
                <Circle className="w-5 h-5 text-emerald-400" />
                <span className="text-white">Познакомься с участниками</span>
              </div>
            </div>
          </div>
        </div>

        {flyingImages.map(image => (
          <img
            key={image.id}
            src="https://static.tildacdn.com/tild3838-3837-4131-b836-333837326233/___1.png"
            alt=""
            className="fixed pointer-events-none"
            style={{
              left: image.x,
              top: image.y,
              width: '64px',
              height: '64px',
              transform: `translate(-50%, -50%) rotate(${image.rotation}deg) scale(${image.scale})`,
              opacity: image.opacity,
              transition: 'opacity 0.2s ease-out',
              zIndex: 20
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Training;