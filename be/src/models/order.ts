import {connection, query} from '../utils/db';
import {Order_combo} from '../utils/returnMapper';
import {Order} from '../utils/types';
import {orderInfoMap} from '../wrapper/order.wrapper';

class OrderModel {
  constructor() {
    //
  }


public async  createOrder(order: Order) {
  const conn = await connection()
  const sql = 'INSERT INTO orders SET ?'
  const newUser = await query(conn, sql, [order])
  return newUser
}

public async  findAllOrders() {
  const conn = await connection()
  const sql = 'SELECT * FROM orders'
  const users = await query(conn, sql)
  return users
}
// public async  createOrderItem(order_item: Order_item) {
//   const conn = await connection()
//   const sql = 'INSERT INTO order_item SET ?'
//   const rst = await query(conn, sql, [order_item])
//   return rst
// }

public async  findOrderInfoById(id) {
  const conn = await connection()
  const sql =
    'SELECT * FROM orders O INNER JOIN order_item OI ON O.id = OI.order_id WHERE O.id = ?'
  const rst = (await query(conn, sql, [id])) as Order_combo[]
  const wrap = await orderInfoMap(rst)
  return wrap
}

public async  findOrderInfoByBuyerId(id) {
  const conn = await connection()
  const sql =
    'SELECT * FROM orders O INNER JOIN order_item OI ON O.id = OI.order_id WHERE O.buyer_id = ?'
  const rst = (await query(conn, sql, [id])) as Order_combo[]
  // const wrap = await orderInfoMap(rst)
  // return wrap
  return rst
}

public async  deleteOrder(id) {
  const conn = await connection()
  const sql = 'DELETE FROM orders WHERE id = ?'
  const rst = await query(conn, sql, [id])
  return rst
}

//UPDATE table1 SET somecolumn = 'someVal' WHERE ID IN (SELECT ID FROM @definedTable);
// public async  editOrderById(id, info: Order) {
//   const conn = await connection()
//   const sql
//   const sql = 'UPDATE orders SET ? WHERE ID in id = ?'
//   await query(conn, sql, [info, id])
//   const rst = await findOrderInfoById(id)
//   return rst
// }

public async  findAllOrderItmes() {
  const conn = await connection()
  const sql = 'SELECT * FROM order_item'
  const users = await query(conn, sql)
  return users
}

public async  findOrderItmesByOrderId(id) {
  const conn = await connection()
  const sql = 'SELECT * FROM order_item WHERE order_id = ?'
  const rst = await query(conn, sql, [id])
  return rst
}

}

export default new OrderModel()
