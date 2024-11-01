import WebApp from '@twa-dev/sdk';
import { saveUserData } from './storage';

export async function addCurrentUser() {
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
    console.error('Error adding current user:', error);
  }
}

export async function updateLastSeen() {
  const user = WebApp.initDataUnsafe?.user;
  if (!user) return;

  try {
    await saveUserData({
      last_seen: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating last seen:', error);
  }
}