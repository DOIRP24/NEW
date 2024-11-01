import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { getAllUsers } from '../services/storage';
import { UserData } from '../types';
import ParticipantCard from '../components/ParticipantCard';
import SearchBar from '../components/SearchBar';
import UserWidget from '../components/UserWidget';
import { useParticipants } from '../hooks/useParticipants';

const Participants = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { participants, isLoading, error } = useParticipants();

  const filteredParticipants = participants.filter(participant => {
    const fullName = `${participant.first_name} ${participant.last_name || ''}`.toLowerCase();
    const username = participant.username?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || username.includes(query);
  });

  const isOnline = (lastSeen: string) => {
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    return now.getTime() - lastSeenDate.getTime() < 2 * 60 * 1000;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1a1a1a] to-[#0A0A0A]">
      <div className="p-4">
        <UserWidget />
      </div>
      <div className="bg-black/60 backdrop-blur-sm p-4">
        <h1 className="text-xl font-bold text-white mb-3">Участники</h1>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск участников..."
        />
      </div>

      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Activity className="w-6 h-6 text-[#00A380] animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-[#00A380] mb-2">{error}</p>
            <p className="text-white/60 text-sm">Показаны локально сохраненные данные</p>
          </div>
        ) : filteredParticipants.length === 0 ? (
          <div className="text-center py-8 text-[#00A380]">
            {searchQuery ? 'Участники не найдены' : 'Нет участников'}
          </div>
        ) : (
          filteredParticipants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              isOnline={isOnline(participant.last_seen)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Participants;