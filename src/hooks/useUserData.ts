import { useState, useEffect, useCallback } from 'react';
import { UserData } from '../types';
import { getUserData, subscribeToUserData } from '../services/storage';

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = useCallback(async () => {
    try {
      setError(null);
      const data = await getUserData();
      setUserData(data);
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!mounted) return;
      await loadUserData();
    };

    load();

    const unsubscribe = subscribeToUserData((newData) => {
      if (mounted) {
        setUserData(newData);
      }
    });

    const interval = setInterval(load, 30000);

    return () => {
      mounted = false;
      unsubscribe();
      clearInterval(interval);
    };
  }, [loadUserData]);

  return { userData, isLoading, error, reloadData: loadUserData };
}