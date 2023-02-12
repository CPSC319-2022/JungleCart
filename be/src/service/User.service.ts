import { db } from '../utils/db.server'
import * as types from '../utils/types'
import { connect, Query } from '../config/mysql'

// export const listUsers = async (): Promise<types.User[]> => {
// return db.user.findMany({
//   select: {
//     id: true,
//     first_name: true,
//     last_name: true,
//     email: true,
//     department: true,
//     // created_at: true,
//   },
// })
// return connect()
//   .then((connection) => {
//     const query = 'SELECT * FROM user'
//     Query(connection, query)
//       .then((result) => {
//         return res.status(200).json({
//           result,
//         })
//       })
//       .catch((error) => {
//         return res.status(200).json({
//           message: error.message,
//           error,
//         })
//       })
//       .finally(() => {
//         connection.end()
//       })
//   })
//   .catch((error) => {
//     return res.status(200).json({
//       message: error.message,
//       error,
//     })
//   })
// }

export const listAddress = async (): Promise<types.Address[]> => {
  return db.address.findMany({
    select: {
      id: true,
      user_id: true,
      address_line_1: true,
      address_line_2: true,
      city: true,
      province: true,
      postal_code: true,
      recipient: true,
      telephone: true,
    },
  })
}
