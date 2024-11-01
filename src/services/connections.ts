import { db } from './database';

export interface Connection {
  id: number;
  user_id: number;
  connected_user_id: number;
  created_at: string;
  last_interaction: string;
}

export async function initConnections() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS connections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      connected_user_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      last_interaction TEXT NOT NULL,
      UNIQUE(user_id, connected_user_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (connected_user_id) REFERENCES users(id)
    )
  `);
}

export async function createConnection(userId: number, connectedUserId: number) {
  const now = new Date().toISOString();
  
  await db.execute({
    sql: `
      INSERT INTO connections (user_id, connected_user_id, created_at, last_interaction)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, connected_user_id) DO UPDATE SET
        last_interaction = excluded.last_interaction
    `,
    args: [userId, connectedUserId, now, now]
  });

  // Update user connections count
  await db.execute({
    sql: 'UPDATE users SET connections = connections + 1 WHERE id IN (?, ?)',
    args: [userId, connectedUserId]
  });
}

export async function getUserConnections(userId: number) {
  const result = await db.execute({
    sql: `
      SELECT u.*, c.created_at, c.last_interaction
      FROM users u
      JOIN connections c ON u.id = c.connected_user_id
      WHERE c.user_id = ?
      ORDER BY c.last_interaction DESC
    `,
    args: [userId]
  });
  return result.rows;
}

export async function getMutualConnections(userId1: number, userId2: number) {
  const result = await db.execute({
    sql: `
      SELECT u.*
      FROM users u
      JOIN connections c1 ON u.id = c1.connected_user_id
      JOIN connections c2 ON u.id = c2.connected_user_id
      WHERE c1.user_id = ? AND c2.user_id = ?
    `,
    args: [userId1, userId2]
  });
  return result.rows;
}