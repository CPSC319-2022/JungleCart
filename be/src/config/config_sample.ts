import dotenv from 'dotenv'

dotenv.config()

//change below
const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost'
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'mysql'
const MYSQL_USER = process.env.MYSQL_USER || 'your user name'
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'your pw'
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost'
const SERVER_PORT = 'your port number'
const MYSQL = {
  host: SERVER_HOSTNAME,
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
