import React from 'react';
import { Clock, MapPin, Check, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Event } from '../types';
import { saveUserData, getUserData } from '../services/storage';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [attended, setAttended] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    const checkAttendance = async () => {
      const userData = await getUserData();
      if (userData) {
        setAttended(userData.sessions_attended > 0);
      }
    };
    
    checkAttendance();
  }, []);

  const handleAttendance = async () => {
    try {
      const userData = await getUserData();
      if (userData) {
        await saveUserData({
          ...userData,
          sessions_attended: userData.sessions_attended + 1
        });
        setAttended(true);
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  return (
    <div 
      className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 mb-4 transform transition-all duration-300 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-xl text-white mb-2">{event.title}</h3>
          <div className="flex items-center text-teal-400/80 mb-2">
            <Clock className="w-4 h-4 mr-2" />
            <span>
              {format(new Date(event.startTime), 'HH:mm', { locale: ru })} -{' '}
              {format(new Date(event.endTime), 'HH:mm', { locale: ru })}
            </span>
          </div>
          <div className="flex items-center text-teal-400/80">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location}</span>
          </div>
        </div>
        <button
          onClick={handleAttendance}
          disabled={attended}
          className={`p-3 rounded-full transition-all duration-300 ${
            attended
              ? 'bg-green-500/20 text-green-400'
              : 'bg-teal-500/20 text-teal-400 hover:bg-teal-500/30'
          } ${isHovered ? 'scale-110' : ''}`}
        >
          <Check className={`w-6 h-6 ${attended ? 'animate-bounce' : ''}`} />
        </button>
      </div>
      
      <div className="mb-4">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-500/20 text-teal-400">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="font-medium">{event.speaker}</span>
        </div>
      </div>
      
      <p className="text-gray-300/90 leading-relaxed">{event.description}</p>
      
      {attended && (
        <div className="mt-4 flex items-center text-green-400">
          <Check className="w-4 h-4 mr-2" />
          <span>Вы записаны</span>
        </div>
      )}
    </div>
  );
};

export default EventCard;