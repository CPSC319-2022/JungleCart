import { Neptune } from 'aws-sdk';
import Model from '/opt/core/Model';
import { Order, OrderQuery, ProductOrder } from '/opt/types/order';
import { RowDataPacket } from 'mysql2';
import NetworkError from '/opt/core/NetworkError';

export default class OrderModel extends Model {
  private readonly _orderItemModel;

  constructor() {
    super();
    this._orderItemModel = new OrderItemModel();
  }

  public getSellerOrders = async (seller_id: number) => {
    const sql = `SELECT oi.id,
                      oi.order_id,
                      oi.product_id,
                      oi.quantity,
                      p.name,
                      p.description,
                      ship.status,
                      pm.url,
                      JSON_OBJECT('first_name', u.first_name, 'last_name', u.last_name,
                                  "email", u.email,
                                  'address', JSON_OBJECT(
                                          'address_line_1', a.address_line_1,
                                          'address_line_2', a.address_line_2,
                                          'city', a.city,
                                          'province', a.province,
                                          'postal_code', a.postal_code,
                                          'recipient', a.recipient,
                                          'telephone', a.telephone
                                      )) AS buyer_info
               FROM dev.order_item oi
                        INNER JOIN dev.product p ON oi.product_id = p.id
                        LEFT JOIN dev.product_multimedia pm ON pm.product_id = p.id
                        INNER JOIN dev.seller s ON p.seller_id = s.id
                        INNER JOIN dev.orders o ON o.id = oi.order_id
                        JOIN dev.buyer b ON o.buyer_id = b.id
                        JOIN dev.address a ON b.pref_address_id = a.id
                        INNER JOIN dev.user u ON u.id = b.id
                        INNER JOIN dev.shipping_status ship ON ship.id = oi.shipping_status_id
               WHERE s.id = ${seller_id}`;

    const rows: RowDataPacket[] = await this.query(sql);
    return rows;
  };

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
      const orders = rows as Order[];
      await Promise.all(
        orders.map(async (order) => {
          order.products = (await this.addOrderInfo(
            order.id
          )) as ProductOrder[];
        })
      );

      return orders;
    } else {
      throw new Error('No order not found');
    }
  };

  addOrderInfo = async (orderId) => {
    const sql = `SELECT  p.id as product_id , p.name as name,oi.quantity, p.price as product_price,
                         shipping.status,
                         pm.url
FROM dev.order_item oi
JOIN dev.product p ON oi.product_id = p.id
JOIN dev.shipping_status shipping ON oi.shipping_status_id = shipping.id
LEFT JOIN dev.product_multimedia pm ON pm.product_id = p.id
 WHERE oi.order_id = ${orderId}`;
    const rows: RowDataPacket[] = await this.query(sql);
    return rows;
  };

  public delete = async (orderId: string): Promise<void> => {
    const sql = `DELETE FROM dev.orders orders WHERE orders.id = ${orderId}`;
    const rows: RowDataPacket[] = await this.query(sql);
    if (rows) {
      return;
    } else {
      throw new Error('Order not found');
    }
  };

  public count = async (
    statusLabel = 'pending',
    userId?: string
  ): Promise<any[]> => {
    const sql = `SELECT 
  orders.id AS id,
  COUNT(*)
FROM dev.orders orders
LEFT JOIN dev.order_status order_status ON orders.order_status_id = order_status.id
WHERE orders.buyer_id = ${userId} AND order_status.label = '${statusLabel}'`;
    const rows: RowDataPacket[] = await this.query(sql);
    if (rows) {
      return rows;
    } else {
      return [];
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
    // TODO: remove hard coded status
    const sql = `INSERT INTO dev.orders (buyer_id, total, order_status_id) VALUES (${userId}, ${subTotal}, 6)`;
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

  public isOrderExist = async (oid) => {
    const sql = `SELECT COUNT(*) FROM dev.orders WHERE id = ?`;
    return await this.query(sql, [oid]);
  };

  public getOrderStatus = async (oid) => {
    const sql = `SELECT o.total, os.label FROM dev.order_status os INNER JOIN dev.orders o ON o.order_status_id = os.id WHERE o.id = ?`;
    return await this.query(sql, [oid]);
  };

  public updateTotalPrice = async (oid, total) => {
    const sql = `UPDATE dev.orders SET total = ? WHERE id = ?`;
    return await this.query(sql, [total, oid]);
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

  public deleteOrderItem = async (oid, pid) => {
    const sql = `DELETE FROM dev.order_item WHERE order_id = ? AND product_id = ?`;
    return await this.query(sql, [oid, pid]);
  };

  public isItemExist = async (oid, pid) => {
    const sql = `SELECT COUNT(*) FROM dev.order_item WHERE order_id = ? AND product_id = ?`;
    return await this.query(sql, [oid, pid]);
  };

  public getWeightedPrice = async (oid, pid) => {
    const sql = `SELECT oi.quantity, p.price, p.discount FROM dev.order_item oi INNER JOIN dev.product p ON oi.product_id = p.id WHERE oi.order_id = ? AND oi.product_id = ?;`;
    return await this.query(sql, [oid, pid]);
  };

  public getShippingStatus = async (oid, pid) => {
    const sql = `SELECT s.status FROM dev.shipping_status s INNER JOIN dev.order_item oi ON s.id = oi.shipping_status_id WHERE oi.order_id = ? AND oi.product_id = ?`;
    return await this.query(sql, [oid, pid]);
  };

  public updateOrderStatusByOrderId = async (orderId) => {
    const itemShipped = await this.isAnyOrderItemShipped(orderId);
    if (itemShipped) {
      await this.changeOrderStatusToShipped(orderId);
    }
    // const allDelivered = await this.isAllOrderItemsDelivered(orderId);
    // if (allDelivered) {
    //   await this.changeOrderStatusToCompleted(orderId);
    // }
  };

  private changeOrderStatusToShipped = async (orderId) => {
    const query = `UPDATE orders SET order_status_id = 3 WHERE id = ${orderId};`;
    return await this.query(query);
  };

  private isAllOrderItemsDelivered = async (orderId) => {
    const query = `
      SELECT
        order_item.order_id
      FROM
        orders
      JOIN order_item ON order_item.order_id = orders.id
      JOIN shipping_status ON shipping_status.id = order_item.shipping_status_id
      WHERE
        order_item.order_id = ${orderId}
      GROUP BY
        order_item.order_id
      HAVING
        COUNT(*) = SUM(CASE WHEN shipping_status.status = 'delivered' THEN 1 ELSE 0 END);
      `;
    const queryResult = await this.query(query);
    return queryResult;
  };

  private changeOrderStatusToCompleted = async (orderId) => {
    const query = `UPDATE orders SET order_status_id = 4 WHERE id = ${orderId};`;
    return await this.query(query);
  };

  private isAnyOrderItemShipped = async (orderId) => {
    const query = `
      SELECT
        shipping_status.status
      FROM
        orders
      JOIN order_item ON order_item.order_id = orders.id
      JOIN shipping_status ON shipping_status.id = order_item.shipping_status_id
      WHERE
        order_id = ${orderId}
      HAVING
        SUM(
          CASE
            WHEN shipping_status.status = 'shipped' THEN 1
            ELSE 0
          END
        ) > 0;
      `;
    const queryResult = await this.query(query);
    return queryResult[0]?.status;
  };

  public updateOrderItem = async (oid, pid, status) => {
    const sql = `UPDATE shipping_status s SET s.status = ? WHERE s.id = ( SELECT oi.shipping_status_id FROM order_item oi WHERE oi.order_id = ? AND oi.product_id = ? );`;
    console.log('sql', sql);
    return await this.query(sql, [status, oid, pid]);
  };
}
