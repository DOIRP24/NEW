import WebApp from '@twa-dev/sdk';
import { UserData } from '../types';
import * as db from './database';

// Initialize database on app start
db.initDatabase().catch(console.error);

export async function getUserData(): Promise<UserData | null> {
  const user = WebApp.initDataUnsafe?.user;
  if (!user) return null;

  try {
    const userData = await db.getUser(user.id);
    
    if (userData) {
      return userData as UserData;
    }

    // Create new user if not exists
    const newUser: UserData = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name || '',
      username: user.username || '',
      photo_url: user.photo_url || '',
      points: 0,
      sessions_attended: 0,
      connections: 0,
      last_seen: new Date().toISOString()
    };

    await db.saveUser(newUser);
    return newUser;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
}

export async function saveUserData(data: Partial<UserData>): Promise<void> {
  const user = WebApp.initDataUnsafe?.user;
  if (!user) return;

  try {
    const currentData = await getUserData();
    if (!currentData) return;

    const updatedData: UserData = {
      ...currentData,
      ...data,
      last_seen: new Date().toISOString()
    };

    await db.saveUser(updatedData);
    notifySubscribers(updatedData);
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
}

export async function incrementPoints(userId: number, amount: number): Promise<void> {
  try {
    await db.updateUserPoints(userId, amount);
    const userData = await db.getUser(userId);
    if (userData) {
      notifySubscribers(userData as UserData);
    }
  } catch (error) {
    console.error('Error incrementing points:', error);
    throw error;
  }
}

export async function getAllUsers(): Promise<UserData[]> {
  try {
    const users = await db.getAllUsers();
    return users as UserData[];
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

// Subscribers for real-time updates
const subscribers = new Set<(data: UserData) => void>();

export const subscribeToUserData = (callback: (data: UserData) => void) => {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
};

const notifySubscribers = (data: UserData) => {
  subscribers.forEach(callback => callback(data));
};