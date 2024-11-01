import React from 'react';
import { User, Award } from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import { useUser } from '../contexts/UserContext';

const UserWidget = () => {
  const { userData, isLoading } = useUser();
  const telegramUser = WebApp.initDataUnsafe?.user;

  if (isLoading) {
    return (
      <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10 animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
          <div className="flex-1">
            <div className="h-5 bg-white/10 rounded w-24 mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData || !telegramUser) return null;

  const getPhotoUrl = () => {
    if (telegramUser.username === 'kadochkindesign') {
      return 'https://static.tildacdn.com/tild6135-3662-4262-a461-313634636562/-2___1.jpg';
    }
    return userData.photo_url || telegramUser.photo_url;
  };

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
      <div className="flex items-center space-x-3">
        <div className="relative">
          {getPhotoUrl() ? (
            <div className="relative w-12 h-12">
              <div 
                className="absolute inset-0 border-2 border-[#00A380]"
                style={{ borderRadius: '0.75rem' }}
              />
              <img
                src={getPhotoUrl()}
                alt={userData.first_name}
                className="absolute inset-[2px] w-[calc(100%-4px)] h-[calc(100%-4px)] object-cover"
                style={{ borderRadius: 'calc(0.75rem - 2px)' }}
              />
            </div>
          ) : (
            <div className="relative w-12 h-12">
              <div 
                className="absolute inset-0 border-2 border-[#00A380]"
                style={{ borderRadius: '0.75rem' }}
              />
              <div 
                className="absolute inset-[2px] bg-gradient-to-br from-[#00A380] to-[#008060] flex items-center justify-center"
                style={{ borderRadius: 'calc(0.75rem - 2px)' }}
              >
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-white">
            {userData.first_name} {userData.last_name}
          </h2>
          <div className="flex items-center gap-2">
            {userData.username && (
              <span className="text-xs text-[#00A380]">@{userData.username}</span>
            )}
            <div className="flex items-center text-[#00A380] bg-[#00A380]/10 px-2 py-0.5 rounded-full">
              <Award className="w-3 h-3 mr-1" />
              <span className="text-xs">{userData.points}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserWidget;