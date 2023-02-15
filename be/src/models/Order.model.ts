import { connection, query } from '../utils/db'
import { Order_combo } from '../utils/returnMapper'
import { Order, Order_item } from '../utils/types'
import { orderInfoMap } from '../wrapper/order.wrapper'

export async function createOrder(order: Order) {
  const conn = await connection()
  const sql = 'INSERT INTO orders SET ?'
  const newUser = await query(conn, sql, [order])
  return newUser
}

export async function findAllOrders() {
  const conn = await connection()
  const sql = 'SELECT * FROM orders'
  const users = await query(conn, sql)
  return users
}
// export async function createOrderItem(order_item: Order_item) {
//   const conn = await connection()
//   const sql = 'INSERT INTO order_item SET ?'
//   const rst = await query(conn, sql, [order_item])
//   return rst
// }

export async function findOrderInfoById(id) {
  const conn = await connection()
  const sql =
    'SELECT * FROM orders O INNER JOIN order_item OI ON O.id = OI.order_id WHERE O.id = ?'
  const rst = (await query(conn, sql, [id])) as Order_combo[]
  const wrap = await orderInfoMap(rst)
  return wrap
}

export async function findOrderInfoByBuyerId(id) {
  const conn = await connection()
  const sql =
    'SELECT * FROM orders O INNER JOIN order_item OI ON O.id = OI.order_id WHERE O.buyer_id = ?'
  const rst = (await query(conn, sql, [id])) as Order_combo[]
  const wrap = await orderInfoMap(rst)
  return wrap
}

export async function deleteOrder(id) {
  const conn = await connection()
  const sql = 'DELETE FROM orders WHERE id = ?'
  const rst = await query(conn, sql, [id])
  return rst
}

//UPDATE table1 SET somecolumn = 'someVal' WHERE ID IN (SELECT ID FROM @definedTable);
// export async function editOrderById(id, info: Order) {
//   const conn = await connection()
//   const sql
//   const sql = 'UPDATE orders SET ? WHERE ID in id = ?'
//   await query(conn, sql, [info, id])
//   const rst = await findOrderInfoById(id)
//   return rst
// }

export async function findAllOrderItmes() {
  const conn = await connection()
  const sql = 'SELECT * FROM order_item'
  const users = await query(conn, sql)
  return users
}

export async function findOrderItmesByOrderId(id) {
  const conn = await connection()
  const sql = 'SELECT * FROM order_item WHERE order_id = ?'
  const rst = await query(conn, sql, [id])
  return rst
}
