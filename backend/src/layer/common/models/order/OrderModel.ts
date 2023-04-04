import Model from '/opt/core/Model';
import { Order, OrderQuery } from '/opt/types/order';
import { RowDataPacket } from 'mysql2';

export default class OrderModel extends Model {
  private readonly _orderItemModel;

  constructor() {
    super();
    this._orderItemModel = new OrderItemModel();
  }

  public read = async (
    orderQuery: OrderQuery,
    userId?: string
  ): Promise<any[]> => {
    let sql = `SELECT 
  orders.id AS id,
  orders.total AS total,
  orders.created_at AS created_at,
  orders.updated_at AS updated_at,
  order_status.label AS status_label,
  JSON_OBJECT(
    'id', buyer.id,
    'address', JSON_OBJECT(
      'id', pref_address.id,
      'address_line_1', pref_address.address_line_1,
      'address_line_2', pref_address.address_line_2,
      'city', pref_address.city,
      'province', pref_address.province,
      'postal_code', pref_address.postal_code,
      'recipient', pref_address.recipient,
      'telephone', pref_address.telephone
    )
  ) AS buyer_info
FROM dev.orders orders
LEFT JOIN dev.order_status order_status ON orders.order_status_id = order_status.id
LEFT JOIN dev.buyer buyer ON orders.buyer_id = buyer.id
LEFT JOIN dev.address AS pref_address ON buyer.pref_address_id = pref_address.id
WHERE 1=1`;
    if (orderQuery.order_id) {
      sql = sql.concat(` AND orders.id = ${orderQuery.order_id}`);
    }
    if (userId) {
      sql = sql.concat(` AND orders.buyer_id = ${userId}`);
    }
    if (orderQuery.sort_by && orderQuery.sort_direction) {
      sql = sql.concat(
        ` ORDER BY orders.${orderQuery.sort_by} ${orderQuery.sort_direction}`
      );
    }
    const rows: RowDataPacket[] = await this.query(sql);
    if (rows) {
      const ret = await Promise.all(
        rows.map(async (row) => {
          const products = await this.addOrderInfo(row.id);
          row.products = products;
          return row;
        })
      );

      return ret as Order[];
    } else {
      throw new Error('No order not found');
    }
  };

  private addOrderInfo = async (orderId) => {
    const sql = `SELECT  p.id as product_id , p.name as name,oi.quantity, p.price as product_price,
                        status.label AS status_label
FROM dev.order_item oi
JOIN dev.product p ON oi.product_id = p.id
JOIN dev.order_status status ON oi.shipping_status_id = status.id
WHERE oi.order_id = ${orderId}`;
    const rows: RowDataPacket[] = await this.query(sql);
    return rows;
  };

  public delete = async (orderId: string): Promise<Order> => {
    const sql = `DELETE * FROM dev.orders orders WHERE id = ${orderId}`;
    const rows: RowDataPacket[] = await this.query(sql);
    if (rows) {
      throw new Error('Order not found');
    } else {
      throw new Error('Order not found');
    }
  };

  public update = async (orderId, orderUpdateParams): Promise<void> => {
    const sql = `UPDATE dev.orders 
                 SET order_status_id = (
                     SELECT ID
                     FROM dev.order_status
                     WHERE LABEL = '${orderUpdateParams.orderStatus}')
                WHERE id = ${orderId}`;

    const rows = await this.query(sql);
    if (rows) {
      return;
    } else {
      throw new Error('Order not found');
    }
  };

  public write = async (userId, subTotal): Promise<number> => {
    const sql = `INSERT INTO dev.orders (buyer_id, total) VALUES (${userId}, ${subTotal})`;
    const result = await this.query(sql);
    return result.insertId;
  };

  public writeItem = async (
    orderId: number,
    product_id: number,
    quantity: number
  ): Promise<number> => {
    let sql = `INSERT INTO dev.shipping_status (status, expected_delivery_date) VALUES ("pending", '2023-04-05')`;
    let result = await this.query(sql);
    const shipping_id = result.insertId;

    sql = `INSERT INTO dev.order_item (order_id, product_id, shipping_status_id, quantity) VALUES (${orderId}, ${product_id}, ${shipping_id}, ${quantity})`;
    result = await this.query(sql);
    return result.insertId;
  };
}

export class OrderItemModel extends Model {
  public read = async (
    orderId?: string,
    productId?: string
  ): Promise<Order> => {
    let sql = `SELECT * FROM dev.order_item WHERE 1=1`;
    if (orderId) {
      sql = sql.concat(`\n orders_id = '${orderId}';`);
    }
    if (productId) {
      sql = sql.concat(`\n product_id = '${productId}';`);
    }
    const rows: RowDataPacket[] = await this.query(sql);
    if (rows) {
      return rows[0] as Order;
    } else {
      throw new Error('Order not found');
    }
  };
}
