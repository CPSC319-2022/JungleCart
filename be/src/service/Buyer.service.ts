import { db } from '../utils/db.server'
import * as types from '../utils/types'

export const listBuyers = async (): Promise<types.Buyer[]> => {
  return db.buyer.findMany({
    select: {
      id: true,
      pref_address_id: true,
      pref_pm_id: true,
    },
  })
}

// export const listPaymentMethod = async (): Promise<types.Payment_method[]> => {
//   return db.payment_method.findMany({
//     select: {
//       id: true,
//       is_paypal: true,
//       paypal_id: true,
//       is_credit: true,
//       bank_name: true,
//       card_num: true,
//       expiration_date: true,
//       first_name: true,
//       last_name: true,
//     },
//   })
// }
