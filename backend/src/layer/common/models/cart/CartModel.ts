import SQLManager from '../../core/SQLManager';

class CartModel {
  public async getCartItems(bid) {
    const sql = `SELECT JSON_OBJECT(
      'products', (SELECT JSON_ARRAYAGG(JSON_OBJECT("id", p.id, "product_uri", pm.url, "name", p.name, "quantity", c.quantity, "price", p.price, "discount", p.discount, "total_quantity", p.total_quantity)))) as cart
      FROM cart_item c
      INNER JOIN product p ON c.product_id = p.id
      INNER JOIN product_multimedia pm ON p.id = pm.product_id
      WHERE c.buyer_id = ?`;
    return await SQLManager.query(sql, [bid]);
  }

  public async addCartItem(info) {
    console.log('add cart in model');
    const sql = `INSERT INTO cart_item SET ?`;
    await SQLManager.query(sql, [info]);
    return await this.confirmCartAdd(info);
  }

  public async findAllCartItems() {
    const sql = 'SELECT * FROM cart_item';
    return await SQLManager.query(sql);
  }

  public async deleteCartItem(bid, pid) {
    const sql = 'DELETE FROM cart_item WHERE buyer_id = ? AND product_id = ?';
    return await SQLManager.query(sql, [bid, pid]);
  }

  public async updateCartItems(bid, info) {
    const sql = `INSERT INTO cart_item (buyer_id, product_id, quantity) VALUES ${info} ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`;
    await SQLManager.query(sql);
    return await this.confirmCartUpdate(bid);
  }

  public async confirmCartAdd(info) {
    const sql = `SELECT product_id, quantity FROM cart_item WHERE buyer_id = ? AND product_id = ?`;
    return await SQLManager.query(sql, [info.buyer_id, info.product_id]);
  }

  public async confirmCartUpdate(bid) {
    const sql = `SELECT JSON_ARRAYAGG(JSON_OBJECT("id", product_id, "quantity", quantity)) as cart_items
      FROM cart_item
      WHERE buyer_id = ?`;
    return await SQLManager.query(sql, [bid]);
  }

  public async isItemExist(bid, pid) {
    const sql = `SELECT COUNT(*) FROM cart_item WHERE buyer_id = ? AND product_id = ?`;
    return await SQLManager.query(sql, [bid, pid]);
  }
  public async itemCount(bid, pid) {
    const sql = `SELECT quantity FROM cart_item WHERE buyer_id = ? AND product_id = ?`;
    return await SQLManager.query(sql, [bid, pid]);
  }

  public async updateQuantity(info) {
    const sql = `UPDATE cart_item SET ? WHERE buyer_id=? AND product_id =?`;
    await SQLManager.query(sql, [info, info.buyer_id, info.product_id]);
    return await this.confirmCartAdd(info);
  }
}

export default new CartModel();
