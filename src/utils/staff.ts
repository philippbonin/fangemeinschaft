import { pool } from '../config/database';

export interface Staff {
  id?: string;
  name: string;
  role: string;
  image: string;
  created_at?: string;
  updated_at?: string;
}

export async function getStaff(): Promise<Staff[]> {
  const conn = await pool.getConnection();
  try {
    return await conn.query('SELECT * FROM staff ORDER BY role, name');
  } finally {
    conn.release();
  }
}

export async function getStaffById(id: string): Promise<Staff | null> {
  const conn = await pool.getConnection();
  try {
    const [staff] = await conn.query('SELECT * FROM staff WHERE id = ?', [id]);
    return staff || null;
  } finally {
    conn.release();
  }
}

export async function createStaff(staff: Omit<Staff, 'id' | 'created_at' | 'updated_at'>): Promise<Staff> {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      'INSERT INTO staff (id, name, role, image) VALUES (UUID(), ?, ?, ?)',
      [staff.name, staff.role, staff.image]
    );
    return { id: result.insertId, ...staff };
  } finally {
    conn.release();
  }
}

export async function updateStaff(id: string, staff: Partial<Staff>): Promise<Staff | null> {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      'UPDATE staff SET name = ?, role = ?, image = ? WHERE id = ?',
      [staff.name, staff.role, staff.image, id]
    );
    return getStaffById(id);
  } finally {
    conn.release();
  }
}

export async function deleteStaff(id: string): Promise<boolean> {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query('DELETE FROM staff WHERE id = ?', [id]);
    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
}