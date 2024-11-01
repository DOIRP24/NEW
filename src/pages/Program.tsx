import React from 'react';
import EventCard from '../components/EventCard';
import UserWidget from '../components/UserWidget';

const Program = () => {
  const events = [
    {
      id: 1,
      title: 'Открытие конференции',
      startTime: '2025-03-15T09:00:00',
      endTime: '2025-03-15T10:00:00',
      speaker: 'Организационный комитет',
      description: 'Торжественное открытие TSPP 2025',
      location: 'Главный зал'
    },
    {
      id: 2,
      title: 'Будущее продуктовой разработки',
      startTime: '2025-03-15T10:30:00',
      endTime: '2025-03-15T12:00:00',
      speaker: 'Александр Петров',
      description: 'Тренды и инновации в продуктовой разработке на 2025 год',
      location: 'Зал A'
    },
    {
      id: 3,
      title: 'AI в продуктовой разработке',
      startTime: '2025-03-15T13:00:00',
      endTime: '2025-03-15T14:30:00',
      speaker: 'Мария Иванова',
      description: 'Практическое применение AI в современной разработке продуктов',
      location: 'Зал B'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1a1a1a] to-[#0A0A0A]">
      <div className="p-4">
        <UserWidget />
      </div>
      <div className="bg-black/60 p-4">
        <h1 className="text-xl font-bold text-white">Программа</h1>
      </div>
      <div className="p-4">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Program;