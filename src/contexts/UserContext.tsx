import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserData } from '../types';
import { getUserData, subscribeToUserData } from '../services/storage';

interface UserContextType {
  userData: UserData | null;
  isLoading: boolean;
  error: string | null;
  updateUserData: (data: Partial<UserData>) => void;
}

const UserContext = createContext<UserContextType>({
  userData: null,
  isLoading: true,
  error: null,
  updateUserData: () => {}
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadUserData = async () => {
      try {
        setError(null);
        const data = await getUserData();
        if (mounted && data) {
          setUserData(data);
        }
      } catch (err) {
        console.error('Error loading user data:', err);
        if (mounted) {
          setError('Ошибка загрузки данных');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadUserData();

    const unsubscribe = subscribeToUserData((newData) => {
      if (mounted) {
        setUserData(newData);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const updateUserData = (data: Partial<UserData>) => {
    if (userData) {
      setUserData({ ...userData, ...data });
    }
  };

  return (
    <UserContext.Provider value={{ userData, isLoading, error, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}