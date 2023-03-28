import Model from '/opt/core/Model';

import { toProduct } from '/opt/models/product/ProductModel';
import { Product, Search } from '/opt/models/product/types';

export class ProductListModel extends Model {
  public read = async (
    filter: Search.Filter,
    order: Search.Order,
    pagination: Search.Pagination
  ): Promise<Product[] | null> => {
    let sql = `SELECT *
                     FROM dev.product p`;

    const { search, categoryId } = filter;

    if (search || categoryId) sql += ` WHERE `;

    if (search) sql += `p.name LIKE '%${search}%'`;

    if (search && categoryId) sql += ` AND `;

    if (categoryId) {
      sql += `p.category_id=${categoryId}`;
    }

    const { by, direction } = order;

    if (by) {
      sql += ` ORDER BY ${by
        .map((column) => `${column} ${direction}`)
        .join(`, `)}`;
    }

    const { limit, page } = pagination;

    const offset = (page - 1) * limit;
    sql += ` LIMIT ${limit} OFFSET ${offset}`;
    console.log(sql)

    const rows = await this.query(sql);
    return rows ? rows.map(toProduct) : null;
  };
}

export default new ProductListModel();
