import { createPool } from 'mariadb';

const pool = createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'fangemeinschaft',
  password: process.env.DB_PASSWORD || 'fangemeinschaft',
  database: process.env.DB_NAME || 'fangemeinschaft',
  connectionLimit: 5
});

// Export a function to get a connection from the pool
export async function getConnection() {
  return await pool.getConnection();
}

// Export the pool directly for cases where it's needed
export { pool };