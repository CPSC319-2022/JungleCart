import dotenv from 'dotenv';

dotenv.config();

const MYSQL = {
  host: process.env.MYSQL_HOST || 'localhost',
  database: process.env.MYSQL_DATABASE || 'db',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '1234',
  port: process.env.MYSQL_PORT || '3306',
};

const databaseLocal = {
  mysql: MYSQL,
};

export default databaseLocal;
