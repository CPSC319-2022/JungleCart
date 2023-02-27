import dotenv from 'dotenv';

dotenv.config();

const MYSQL = {
  host: process.env.MYSQL_HOST || 'localhost',
  database: process.env.MYSQL_DATABASE || 'jungle_cart',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '1234',
  port: process.env.MYSQL_PORT || '3306',
};

const RDS = {
  hostname:
    process.env.RDS_HOSTNAME ||
    'sqldb.cyg4txabxn5r.us-west-2.rds.amazonaws.com',
  databse: process.env.RDS_DB || 'sqlDB',
  user: process.env.RDS_USERNAME || 'admin',
  password: process.env.RDS_PASSWORD || 'password',
  port: process.env.RDS_PORT || '3306',
};

const databaseLocal = {
  mysql: MYSQL,
  rds: RDS,
};

export default databaseLocal;
