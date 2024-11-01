import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Users, Brain } from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Главная' },
    { to: '/program', icon: Calendar, label: 'Программа' },
    { to: '/participants', icon: Users, label: 'Участники' },
    { to: '/training', icon: Brain, label: 'Прокачка' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-teal-500/20">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 transition-all duration-300 ${
                isActive 
                  ? 'text-teal-400 scale-110' 
                  : 'text-gray-400 hover:text-teal-400/80'
              }`
            }
          >
            <Icon className={`w-6 h-6 transition-transform duration-300`} />
            <span className="text-xs mt-1">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;