import { pool } from '../config/database';
import { hashPassword } from './auth';
import type { User } from '../types/user';

export async function getUsers(): Promise<User[]> {
  const conn = await pool.getConnection();
  try {
    return await conn.query(
      'SELECT id, firstName, lastName, email, lastLogin, created_at, updated_at FROM users'
    );
  } finally {
    conn.release();
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const conn = await pool.getConnection();
  try {
    const [user] = await conn.query(
      'SELECT id, firstName, lastName, email, lastLogin, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return user || null;
  } finally {
    conn.release();
  }
}

export async function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
  const conn = await pool.getConnection();
  try {
    const hashedPassword = await hashPassword(user.password);
    const result = await conn.query(
      'INSERT INTO users (id, firstName, lastName, email, password) VALUES (UUID(), ?, ?, ?, ?)',
      [user.firstName, user.lastName, user.email, hashedPassword]
    );
    return { id: result.insertId, ...user };
  } finally {
    conn.release();
  }
}

export async function updateUser(id: string, user: Partial<User>): Promise<User | null> {
  const conn = await pool.getConnection();
  try {
    let query = 'UPDATE users SET firstName = ?, lastName = ?, email = ?';
    const params = [user.firstName, user.lastName, user.email];

    if (user.password) {
      query += ', password = ?';
      params.push(await hashPassword(user.password));
    }

    query += ' WHERE id = ?';
    params.push(id);

    await conn.query(query, params);
    return getUserById(id);
  } finally {
    conn.release();
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
}