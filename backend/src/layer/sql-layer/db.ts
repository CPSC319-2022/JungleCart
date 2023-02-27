import mysql from 'mysql';

export function createPool(
  hostname: string,
  user: string,
  password: string,
  port: string
) {
  const pool = mysql.createPool({
    database: process.env.RDS_NAME,
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: Number(process.env.RDS_PORT),
    multipleStatements: true,
    connectTimeout: 60 * 60 * 1000,
    timeout: 60 * 60 * 1000,
    debug: true,
  });

  return pool;
}
