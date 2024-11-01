import React from 'react';
import { Award, Sparkles } from 'lucide-react';
import { UserData } from '../types';

interface ParticipantCardProps {
  participant: UserData;
  isOnline: boolean;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant, isOnline }) => {
  const getPhotoUrl = () => {
    if (participant.username === 'kadochkindesign') {
      return 'https://static.tildacdn.com/tild6135-3662-4262-a461-313634636562/-2___1.jpg';
    }
    return participant.photo_url;
  };

  return (
    <button 
      className="w-full bg-black/40 backdrop-blur-md rounded-xl p-4 flex items-center hover:bg-[#00A380]/10 transition-all duration-300 transform hover:scale-[1.02] group border border-white/10"
    >
      <div className="relative">
        <div className="relative w-12 h-12">
          {getPhotoUrl() ? (
            <>
              <div 
                className="absolute inset-0 border-2 border-[#00A380] group-hover:border-[#00A380]/80 transition-colors"
                style={{ borderRadius: '1rem' }}
              />
              <img
                src={getPhotoUrl()}
                alt={participant.first_name}
                className="absolute inset-[2px] w-[calc(100%-4px)] h-[calc(100%-4px)] object-cover"
                style={{ borderRadius: 'calc(1rem - 2px)' }}
              />
            </>
          ) : (
            <>
              <div 
                className="absolute inset-0 border-2 border-[#00A380] group-hover:border-[#00A380]/80 transition-colors"
                style={{ borderRadius: '1rem' }}
              />
              <div 
                className="absolute inset-[2px] bg-gradient-to-br from-[#00A380] to-[#008060] flex items-center justify-center"
                style={{ borderRadius: 'calc(1rem - 2px)' }}
              >
                <span className="text-white text-lg font-semibold">
                  {participant.first_name[0]}
                </span>
              </div>
            </>
          )}
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00A380] rounded-full border-2 border-black">
            <div className="absolute inset-0 bg-[#00A380] rounded-full animate-ping opacity-75"></div>
          </div>
        )}
      </div>
      <div className="ml-4 flex-1">
        <h3 className="font-semibold text-white flex items-center">
          {participant.first_name} {participant.last_name}
          {(participant.points || 0) > 100 && (
            <Sparkles className="w-4 h-4 text-[#00A380] ml-2 animate-pulse" />
          )}
        </h3>
        <div className="flex items-center gap-2">
          {participant.username && (
            <span className="text-sm text-[#00A380]/80">@{participant.username}</span>
          )}
          <div className="flex items-center text-[#00A380] text-sm">
            <Award className="w-3 h-3 mr-1" />
            <span>{participant.points || 0}</span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ParticipantCard;