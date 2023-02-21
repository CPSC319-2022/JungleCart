import { connection, query } from '../utils/db';

class CartModel {
  public async addCartItem(info) {
    const conn = await connection();
    const sql = 'INSERT INTO cart_item SET ?';
    const ci = await query(conn, sql, [info]);
    return ci;
  }

  public async findAllCartItems() {
    const conn = await connection();
    const sql = 'SELECT * FROM cart_item';
    const users = await query(conn, sql);
    return users;
  }

  public async deleteCartItem(id) {
    //
  }

  public async getCartItems(id) {
    const conn = await connection();
    const sql =
      'SELECT JSON_ARRAYAGG(JSON_OBJECT("id", P.id, "product_uri", pm.url, "name", p.name, "quantity", c.quantity, "price", p.price)) FROM cart_item c ' +
      'INNER JOIN product P ON c.product_id = p.id ' +
      'INNER JOIN product_multimedia PM ON p.id = pm.product_id ' +
      'WHERE c.buyer_id = ?';
    const items = await query(conn, sql, [id]);
    console.log('itmes', items);
    return items;
  }

  public async updateCartItems(id, info) {
    const conn = await connection();
    const placeholder = info
      .map((e) => `(${e.buyer_id}, ${e.product_id}, ${e.quantity})`)
      .join(', ');
    const sql = `INSERT INTO cart_item (buyer_id, product_id, quantity) VALUES ${placeholder} ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`;
    const ci = await query(conn, sql);
    return ci;
  }
}

export default new CartModel();
