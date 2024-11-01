import { db } from './database';

export interface LeaderboardEntry {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
  points: number;
  rank: number;
}

export async function getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
  const result = await db.execute({
    sql: `
      WITH RankedUsers AS (
        SELECT 
          *,
          RANK() OVER (ORDER BY points DESC) as rank
        FROM users
      )
      SELECT 
        id,
        first_name,
        last_name,
        username,
        photo_url,
        points,
        rank
      FROM RankedUsers
      WHERE rank <= ?
      ORDER BY rank
    `,
    args: [limit]
  });
  return result.rows as LeaderboardEntry[];
}

export async function getUserRank(userId: number): Promise<{ rank: number; total: number }> {
  const rankResult = await db.execute({
    sql: `
      WITH RankedUsers AS (
        SELECT 
          id,
          RANK() OVER (ORDER BY points DESC) as rank
        FROM users
      )
      SELECT rank
      FROM RankedUsers
      WHERE id = ?
    `,
    args: [userId]
  });

  const totalResult = await db.execute('SELECT COUNT(*) as total FROM users');

  return {
    rank: rankResult.rows[0]?.rank || 0,
    total: totalResult.rows[0]?.total || 0
  };
}

export async function getTopPerformers(category: 'sessions' | 'connections', limit: number = 5) {
  const field = category === 'sessions' ? 'sessions_attended' : 'connections';
  
  const result = await db.execute({
    sql: `
      SELECT 
        id,
        first_name,
        last_name,
        username,
        photo_url,
        ${field} as value
      FROM users
      ORDER BY ${field} DESC
      LIMIT ?
    `,
    args: [limit]
  });
  return result.rows;
}