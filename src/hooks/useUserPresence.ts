import { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { saveUserData } from '../services/storage';

export function useUserPresence() {
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updatePresence = async () => {
      const user = WebApp.initDataUnsafe?.user;
      if (!user) return;

      try {
        await saveUserData({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          photo_url: user.photo_url,
          sessions_attended: 0,
          connections: 0,
          last_seen: new Date().toISOString()
        });
      } catch (error) {
        console.error('Failed to update user presence:', error);
      }
    };

    // Update presence immediately when the app loads
    updatePresence();

    // Update presence periodically while the app is open
    interval = setInterval(updatePresence, 30000);

    // Update presence when the app becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updatePresence();
      }
    };

    // Update presence before the app closes
    const handleBeforeUnload = () => {
      if (WebApp.initDataUnsafe?.user) {
        saveUserData({
          last_seen: new Date().toISOString()
        }).catch(console.error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, []);
}