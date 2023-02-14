import { createPool } from 'mysql2/promise'
import mysql from 'mysql'
import config from '../config/config'

export function connection() {
  const connection = mysql.createPool({
    user: config.mysql.user,
    password: config.mysql.password,
    host: config.mysql.host,
    connectionLimit: 10,
    database: config.mysql.database,
  })
  return connection
}

export const query = async (connection: mysql.Pool, query: string) => {
  const conn = await connection
  return new Promise((resolve, reject) => {
    conn.query(query, conn, (error, result) => {
      if (error) {
        reject(error)
        return
      } else {
        // console.log(result)
        resolve(result)
      }
    })
  })
}
