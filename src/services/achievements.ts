import { createClient } from '@libsql/client';
import { db } from './database';
import { UserData } from '../types';

export interface Achievement {
  id: number;
  title: string;
  description: string;
  points: number;
  icon: string;
  requirement: number;
  type: 'sessions' | 'connections' | 'points';
}

export async function initAchievements() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      points INTEGER NOT NULL,
      icon TEXT NOT NULL,
      requirement INTEGER NOT NULL,
      type TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS user_achievements (
      user_id INTEGER,
      achievement_id INTEGER,
      earned_at TEXT NOT NULL,
      PRIMARY KEY (user_id, achievement_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (achievement_id) REFERENCES achievements(id)
    )
  `);
}

export async function createAchievement(achievement: Omit<Achievement, 'id'>) {
  const result = await db.execute({
    sql: `
      INSERT INTO achievements (title, description, points, icon, requirement, type)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING id
    `,
    args: [
      achievement.title,
      achievement.description,
      achievement.points,
      achievement.icon,
      achievement.requirement,
      achievement.type
    ]
  });
  return result.rows[0].id;
}

export async function checkAndAwardAchievements(userData: UserData) {
  const achievements = await db.execute('SELECT * FROM achievements');
  
  for (const achievement of achievements.rows) {
    const hasEarned = await db.execute({
      sql: 'SELECT 1 FROM user_achievements WHERE user_id = ? AND achievement_id = ?',
      args: [userData.id, achievement.id]
    });

    if (hasEarned.rows.length === 0) {
      let earned = false;
      
      switch (achievement.type) {
        case 'sessions':
          earned = userData.sessions_attended >= achievement.requirement;
          break;
        case 'connections':
          earned = userData.connections >= achievement.requirement;
          break;
        case 'points':
          earned = userData.points >= achievement.requirement;
          break;
      }

      if (earned) {
        await db.execute({
          sql: `
            INSERT INTO user_achievements (user_id, achievement_id, earned_at)
            VALUES (?, ?, datetime('now'))
          `,
          args: [userData.id, achievement.id]
        });

        await db.execute({
          sql: 'UPDATE users SET points = points + ? WHERE id = ?',
          args: [achievement.points, userData.id]
        });
      }
    }
  }
}