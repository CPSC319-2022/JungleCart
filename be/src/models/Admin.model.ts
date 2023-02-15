import { connection, query } from '../utils/db'

export async function createAdmin(
  email,
  first_name,
  last_name,
  department,
  role
) {
  const conn = await connection()
  const sql = `INSERT INTO 
    admin(email, first_name, last_name, department, role) 
    VALUES
    ('${email}','${first_name}','${last_name}', '${department}', '${role}')`
  const newUser = await query(conn, sql)
  return newUser
}

export async function findAllAdmins() {
  const conn = await connection()
  const sql = 'SELECT * FROM admin'
  const users = await query(conn, sql)
  return users
}