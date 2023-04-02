import Model from "/opt/core/Model";
import { RowDataPacket } from "/opt/types/sql-query-result";
import { Order, OrderItem } from "/opt/types/order";
import SQLManager from "/opt/core/SQLManager";


export default class OrderModel extends Model {
  get orderItemModel(): OrderItemModel {
    return this._orderItemModel;
  }
  private readonly _orderItemModel;

  constructor() {
    super();
    this._orderItemModel = new OrderItemModel();
  }

  public read = async(orderId?: string): Promise<Order> => {
    let sql = `SELECT * FROM dev.orders orders`;
    if (orderId) {
      sql = sql.concat(`\nWHERE orders.id = '${orderId}'`);
    }
    const rows: RowDataPacket[] = await this.query(sql);
    if (rows) {
      return rows[0] as Order;
    } else {
      throw new Error("Order not found");
    }
  };


  public delete = async(orderId: string): Promise<Order> => {
    const sql = `DELETE * FROM dev.orders orders WHERE id = ${orderId}`;
    const rows: RowDataPacket[] = await this.query(sql);
    if (rows) {
      throw new Error("Order not found");
    } else {
      throw new Error("Order not found");
    }
  };

  public update = async(): Promise<Order> => {
    const sql = `SELECT * FROM dev.order orders`;
    const rows: RowDataPacket[] = await this.query(sql);
    if (rows) {
      throw new Error("Order not found");
    } else {
      throw new Error("Order not found");
    }
  };

  public write = async (userId): Promise<number> => {
      const sql = `INSERT INTO dev.orders (buyer_id) VALUES (${userId})`;
      const result = await SQLManager.query(sql);
      return result.insertId;
  };

  public writeItem = async (orderId: number, product_id: number,quantity: number) : Promise<number> => {
    let sql = `INSERT INTO dev.shipping_status (status, expected_delivery_date) VALUES ("pending", '2023-04-05')`;
    let result =  await this.query(sql);
    const shipping_id = result.insertId;

    sql = `INSERT INTO dev.order_item (order_id, product_id, shipping_status_id, quantity) VALUES (${orderId}, ${product_id}, ${shipping_id}, ${quantity})`;
    result =  await this.query(sql);
    return result.insertId;
  };

}


export class OrderItemModel extends Model{


  public read = async(orderId?: string, productId?: string): Promise<Order> => {
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
      throw new Error("Order not found");
    }
  };

}
