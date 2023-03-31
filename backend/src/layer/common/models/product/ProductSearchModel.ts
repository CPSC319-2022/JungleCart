import Model from '/opt/core/Model';
import { RowDataPacket } from '/opt/models/product/types/query-result';
import {
  isProduct,
  Product,
  toProduct,
} from '/opt/models/product/types/product';
import { Query } from '/opt/models/product/types/query';

export class ProductSearchModel extends Model {
  public read = async (query: Query): Promise<Product[] | null> => {
    let sql = `SELECT *
                     FROM dev.product p`;

    const { search, categoryId } = query;

    if (search || categoryId) sql += ` WHERE `;

    if (search) sql += `p.name LIKE '%${search}%'`;

    if (search && categoryId) sql += ` AND `;

    if (categoryId) {
      sql += `p.category_id=${categoryId}`;
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

    return rows ? rows.map(toProduct).filter(isProduct) : null;
  };
}

export default new ProductSearchModel();
