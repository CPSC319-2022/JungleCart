
import { createPool } from 'mysql2/promise'
import config from '../config/config'

export async function connect() {
  const connection = await createPool({
    user: config.mysql.user,
    password: config.mysql.password,
    host: config.mysql.host,
    connectionLimit: 10,
    database: 'mysql',
  })
  return connection
}