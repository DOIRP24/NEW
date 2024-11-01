import React, { useEffect, useState } from 'react';
import { User, Award, Sparkles } from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import { getUserData, saveUserData } from '../services/storage';

const Profile = () => {
  const telegramUser = WebApp.initDataUnsafe?.user;
  const [userData, setUserData] = useState({
    photo_url: telegramUser?.photo_url || '',
    first_name: telegramUser?.first_name || '',
    last_name: telegramUser?.last_name || '',
    username: telegramUser?.username || '',
    points: 0
  });

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const storedData = await getUserData();
        if (storedData) {
          let photoUrl = telegramUser?.photo_url || storedData.photo_url || '';
          
          if (telegramUser?.username === 'kadochkindesign') {
            photoUrl = 'tg://user?id=kadochkindesign';
          }

          setUserData(prev => ({
            ...prev,
            ...storedData,
            photo_url: photoUrl,
            first_name: telegramUser?.first_name || storedData.first_name,
            last_name: telegramUser?.last_name || storedData.last_name || '',
            username: telegramUser?.username || storedData.username || ''
          }));
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      }
    };

    if (telegramUser) {
      initializeUser();
    }
  }, [telegramUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-gray-900 to-emerald-950">
      <div className="relative p-4">
        <div className="bg-emerald-900/20 backdrop-blur-md rounded-xl p-4 border border-emerald-500/10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {userData.photo_url ? (
                <div className="relative w-16 h-16">
                  <div 
                    className="absolute inset-0 border-2 border-emerald-400"
                    style={{ borderRadius: '1rem' }}
                  />
                  <img
                    src={userData.photo_url}
                    alt={userData.first_name}
                    className="absolute inset-[2px] w-[calc(100%-4px)] h-[calc(100%-4px)] object-cover"
                    style={{ borderRadius: 'calc(1rem - 2px)' }}
                  />
                </div>
              ) : (
                <div className="relative w-16 h-16">
                  <div 
                    className="absolute inset-0 border-2 border-emerald-400"
                    style={{ borderRadius: '1rem' }}
                  />
                  <div 
                    className="absolute inset-[2px] bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center"
                    style={{ borderRadius: 'calc(1rem - 2px)' }}
                  >
                    <User className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white mb-1">
                {userData.first_name} {userData.last_name}
              </h1>
              <div className="flex items-center gap-2">
                {userData.username && (
                  <span className="text-sm text-emerald-400">@{userData.username}</span>
                )}
                <div className="flex items-center text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  <Award className="w-3 h-3 mr-1" />
                  <span className="text-sm">{userData.points}</span>
                </div>
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="bg-emerald-900/20 backdrop-blur-md rounded-xl p-4 border border-emerald-500/10">
          <div className="text-white/90 space-y-2">
            <p>Добро пожаловать в TSPP 2025!</p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Следите за программой конференции</li>
              <li>Общайтесь с участниками</li>
              <li>Зарабатывайте баллы</li>
              <li>Смотрите прямую трансляцию</li>
            </ul>
            <div className="relative aspect-video rounded-xl overflow-hidden mt-3">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                src="https://dl.dropboxusercontent.com/scl/fi/komfpmygc6tdhd52q9i3w/_2_1_1_1-1.mp4?rlkey=vyq4ujf4f228c709qo6ug2v93&st=54yhncqa&dl=0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;