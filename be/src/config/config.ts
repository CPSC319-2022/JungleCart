import dotenv from 'dotenv'

dotenv.config()

//change below
const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost'
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'jungle_cart'
const MYSQL_USER = process.env.MYSQL_USER || 'root'
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'kafka12%23%24'
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost'
const SERVER_PORT = 3306
const MYSQL = {
  host: MYSQL_HOST,
  database: MYSQL_DATABASE,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
}

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
}

const config = {
  mysql: MYSQL,
  server: SERVER,
}

export default config
