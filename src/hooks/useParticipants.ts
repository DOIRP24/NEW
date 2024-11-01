import { useState, useEffect, useCallback } from 'react';
import { UserData } from '../types';
import { getAllUsers } from '../services/storage';

const CACHE_DURATION = 30000; // 30 seconds

export function useParticipants() {
  const [participants, setParticipants] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(0);

  const loadParticipants = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastUpdate < CACHE_DURATION) {
      return;
    }

    try {
      setError(null);
      const data = await getAllUsers();
      
      if (data.length > 0) {
        setParticipants(data);
        setLastUpdate(now);
      } else if (participants.length === 0) {
        setError('Не удалось загрузить список участников');
      }
    } catch (err) {
      console.error('Error loading participants:', err);
      if (participants.length === 0) {
        setError('Ошибка загрузки данных');
      }
    } finally {
      setIsLoading(false);
    }
  }, [lastUpdate, participants.length]);

  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout;

    const load = async () => {
      if (!mounted) return;
      await loadParticipants();
    };

    load();
    intervalId = setInterval(load, CACHE_DURATION);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [loadParticipants]);

  return {
    participants,
    isLoading,
    error,
    reloadParticipants: () => loadParticipants(true)
  };
}