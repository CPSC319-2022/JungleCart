import { connection, query } from '../utils/db'

export async function createUser(first_name, last_name, email, department) {
  const conn = await connection()
  const sql = `INSERT INTO 
    user(first_name, last_name, email, department) 
    VALUES
    ('${first_name}','${last_name}','${email}','${department}')`
  const newUser = await query(conn, sql)
  return newUser
}

export async function findAllUsers() {
  console.log('!!!')
  const conn = await connection()
  const sql = 'SELECT * FROM user'
  const users = await query(conn, sql)
  return users
}
