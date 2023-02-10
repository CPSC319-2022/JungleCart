import { db } from '../utils/db.server'
import * as types from '../utils/types'

export const listUsers = async (): Promise<types.User[]> => {
  return db.user.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      gender: true,
    },
  })
}
