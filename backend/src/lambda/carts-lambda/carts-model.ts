/* eslint-disable @typescript-eslint/no-var-requires */
const {
  queryPool,
  createConnectionPool,
} = require('/opt/nodejs/node_modules/sql-layer');

createConnectionPool(
  process.env.RDS_HOSTNAME,
  process.env.RDS_USERNAME,
  process.env.RDS_PASSWORD,
  process.env.RDS_PORT || '3306',
  process.env.RDS_NAME || 'sqlDB'
);

class CartModel {
  public async getCartItems(bid) {
    const sql = `SELECT JSON_OBJECT(
      'products', (SELECT JSON_ARRAYAGG(JSON_OBJECT("id", p.id, "product_uri", pm.url, "name", p.name, "quantity", c.quantity, "price", p.price)))) as cart
      FROM sqlDB.cart_item c
      INNER JOIN sqlDB.product p ON c.product_id = p.id
      INNER JOIN sqlDB.product_multimedia pm ON p.id = pm.product_id
      WHERE c.buyer_id = ?`;
    return await queryPool(sql, [bid]);
  }

  public async addCartItem(info) {
    console.log('add cart in model');
    const sql = `INSERT INTO sqlDB.cart_item SET ?`;
    await queryPool(sql, [info]);
    return await this.confirmCartAdd(info);
  }

  public async findAllCartItems() {
    const sql = 'SELECT * FROM sqlDB.cart_item';
    return await queryPool(sql);
  }

  public async deleteCartItem(bid, pid) {
    const sql =
      'DELETE FROM sqlDB.cart_item WHERE buyer_id = ? AND product_id = ?';
    return await queryPool(sql, [bid, pid]);
  }

  public async updateCartItems(bid, info) {
    const sql = `INSERT INTO sqlDB.cart_item (buyer_id, product_id, quantity) VALUES ${info} ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`;
    await queryPool(sql);
    return await this.confirmCartUpdate(bid);
  }

  public async confirmCartAdd(info) {
    const sql = `SELECT product_id, quantity FROM sqlDB.cart_item WHERE buyer_id = ? AND product_id = ?`;
    return await queryPool(sql, [info.buyer_id, info.product_id]);
  }

  public async confirmCartUpdate(bid) {
    const sql = `SELECT JSON_ARRAYAGG(JSON_OBJECT("id", buyer_id, "quantity", quantity)) as cart_items
      FROM sqlDB.cart_item
      WHERE buyer_id = ?`;
    return await queryPool(sql, [bid]);
  }
}

export default new CartModel();

type response = { statusCode: number; body: object | string };
