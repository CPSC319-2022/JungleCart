import Model from '/opt/core/Model';
import { RowDataPacket } from '/opt/types/database';
import { isProduct, Product, toProduct } from '/opt/types/product';
import { Query } from '/opt/types/query';

export default class ProductSearchModel extends Model {
  public read = async (query: Query): Promise<Product[]> => {
    let sql = `SELECT *
                     FROM ${this.database}.product p
                     WHERE p.total_quantity > 0`;

    const { search, categoryId } = query;

    if (search) sql += ` AND p.name LIKE '%${search}%'`;

    if (categoryId) {
      sql += ` AND p.category_id=${categoryId}`;
    }

    const { by, direction } = query;

    if (by) {
      sql += ` ORDER BY ${by
        .map((column) => `${column} ${direction}`)
        .join(`, `)}`;
    }

    const { limit, page } = query;

    const offset = (page - 1) * limit;
    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    const rows: RowDataPacket[] = await this.query(sql);

    return rows.map(toProduct).filter(isProduct);
  };
}
