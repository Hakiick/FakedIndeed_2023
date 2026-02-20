import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(process.env.MYSQL_SSL === 'true' && {
    ssl: { rejectUnauthorized: true },
  }),
});

export async function query<T>(sql: string, values?: unknown[]): Promise<T> {
  const [rows] = await pool.execute(sql, values);
  return rows as T;
}

export default pool;
