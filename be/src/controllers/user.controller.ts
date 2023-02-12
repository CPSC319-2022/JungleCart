import { Request, Response } from 'express'
import { connect } from '../utils/db'

export async function listUsers(
  req: Request,
  res: Response
): Promise<Response> {
  const conn = await connect()
  const users = await conn.query('SELECT * FROM product')
  return res.json(users)
}
