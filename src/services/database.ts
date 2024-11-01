import { createClient } from '@libsql/client';
import { initAchievements } from './achievements';
import { initConnections } from './connections';

export const db = createClient({
  url: 'file:local.db',
});

export async function initDatabase() {
  try {
    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT,
        username TEXT,
        photo_url TEXT,
        points INTEGER DEFAULT 0,
        sessions_attended INTEGER DEFAULT 0,
        connections INTEGER DEFAULT 0,
        last_seen TEXT NOT NULL,
        bio TEXT,
        company TEXT,
        position TEXT,
        interests TEXT
      )
    `);

    // Create events table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        speaker TEXT NOT NULL,
        description TEXT,
        location TEXT,
        max_participants INTEGER,
        category TEXT,
        tags TEXT
      )
    `);

    // Create attendance table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS attendance (
        user_id INTEGER,
        event_id INTEGER,
        timestamp TEXT NOT NULL,
        feedback TEXT,
        rating INTEGER CHECK (rating BETWEEN 1 AND 5),
        PRIMARY KEY (user_id, event_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (event_id) REFERENCES events(id)
      )
    `);

    // Initialize other modules
    await Promise.all([
      initAchievements(),
      initConnections()
    ]);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// User operations
export async function getUser(id: number) {
  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE id = ?',
    args: [id]
  });
  return result.rows[0];
}

export async function saveUser(userData: any) {
  const {
    id, first_name, last_name, username, photo_url,
    points, sessions_attended, connections, last_seen,
    bio, company, position, interests
  } = userData;
  
  await db.execute({
    sql: `
      INSERT INTO users (
        id, first_name, last_name, username, photo_url,
        points, sessions_attended, connections, last_seen,
        bio, company, position, interests
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        username = excluded.username,
        photo_url = excluded.photo_url,
        points = excluded.points,
        sessions_attended = excluded.sessions_attended,
        connections = excluded.connections,
        last_seen = excluded.last_seen,
        bio = excluded.bio,
        company = excluded.company,
        position = excluded.position,
        interests = excluded.interests
    `,
    args: [
      id, first_name, last_name, username, photo_url,
      points, sessions_attended, connections, last_seen,
      bio, company, position, interests
    ]
  });
}

export async function getAllUsers() {
  const result = await db.execute('SELECT * FROM users ORDER BY points DESC');
  return result.rows;
}

export async function updateUserPoints(userId: number, points: number) {
  await db.execute({
    sql: 'UPDATE users SET points = points + ? WHERE id = ?',
    args: [points, userId]
  });
}

// Event operations
export async function saveEvent(eventData: any) {
  const {
    title, start_time, end_time, speaker, description,
    location, max_participants, category, tags
  } = eventData;
  
  const result = await db.execute({
    sql: `
      INSERT INTO events (
        title, start_time, end_time, speaker, description,
        location, max_participants, category, tags
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING id
    `,
    args: [
      title, start_time, end_time, speaker, description,
      location, max_participants, category, tags
    ]
  });
  
  return result.rows[0].id;
}

export async function getEvents() {
  const result = await db.execute('SELECT * FROM events ORDER BY start_time');
  return result.rows;
}

export async function getEventsByCategory(category: string) {
  const result = await db.execute({
    sql: 'SELECT * FROM events WHERE category = ? ORDER BY start_time',
    args: [category]
  });
  return result.rows;
}

// Attendance operations
export async function markAttendance(userId: number, eventId: number, feedback?: string, rating?: number) {
  await db.execute({
    sql: `
      INSERT INTO attendance (user_id, event_id, timestamp, feedback, rating)
      VALUES (?, ?, datetime('now'), ?, ?)
      ON CONFLICT(user_id, event_id) DO UPDATE SET
        feedback = excluded.feedback,
        rating = excluded.rating
    `,
    args: [userId, eventId, feedback, rating]
  });
}

export async function getEventAttendance(eventId: number) {
  const result = await db.execute({
    sql: `
      SELECT u.*, a.feedback, a.rating, a.timestamp
      FROM users u
      JOIN attendance a ON u.id = a.user_id
      WHERE a.event_id = ?
      ORDER BY a.timestamp DESC
    `,
    args: [eventId]
  });
  return result.rows;
}

export async function getEventFeedback(eventId: number) {
  const result = await db.execute({
    sql: `
      SELECT 
        a.feedback,
        a.rating,
        a.timestamp,
        u.first_name,
        u.last_name,
        u.username,
        u.photo_url
      FROM attendance a
      JOIN users u ON a.user_id = u.user_id
      WHERE a.event_id = ? AND (a.feedback IS NOT NULL OR a.rating IS NOT NULL)
      ORDER BY a.timestamp DESC
    `,
    args: [eventId]
  });
  return result.rows;
}

export default db;