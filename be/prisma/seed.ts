import { db } from '../src/utils/db.server'
import * as types from '../src/utils/types'

async function seed() {
  await Promise.all(
    getUsers().map((user) => {
      return db.user.create({
        data: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          gender: user.gender,
        },
      })
    })
  )
}

seed()

function getUsers(): Array<types.User> {
  return [
    {
      id: 1,
      first_name: 'test1',
      last_name: 'test1',
      email: 'test1@gmail.com',
      gender: 'F',
    },
    {
      id: 2,
      first_name: 'test2',
      last_name: 'test2',
      email: 'test2@gmail.com',
      gender: 'M',
    },
    {
      id: 3,
      first_name: 'test3',
      last_name: 'test3',
      email: 'test3@gmail.com',
      gender: 'F',
    },
  ]
}
