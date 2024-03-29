import Model from '/opt/core/Model';
import CategoryModel from '/opt/models/product/primitive/CategoryModel';

import { Query } from '/opt/types/query';
import { isProduct, Product, toProduct } from '/opt/types/product';
import { MySqlDatabaseApi, RowDataPacket } from '/opt/types/database';

export class ProductsCompositeModel extends Model {
  private readonly categoryModel: CategoryModel;

  constructor(database: MySqlDatabaseApi, categoryModel?: CategoryModel) {
    super(database);
    this.categoryModel = categoryModel ?? new CategoryModel(database);
  }

  public read = async (
    query: Query,
    categoryName: string | undefined
  ): Promise<Product[]> => {
    if (categoryName?.length) {
      const category = await this.categoryModel.read(categoryName);

      if (category) {
        query.categoryId = category.id;
      }
    }

    let sql = `SELECT p.*, pm.img
               FROM ${this.database}.product p
                        LEFT JOIN (SELECT product_id, JSON_ARRAYAGG(JSON_OBJECT('id', id, 'url', url)) AS img
                                   FROM ${this.database}.product_multimedia
                                   GROUP BY product_id) pm on p.id = pm.product_id
               WHERE p.total_quantity > 0
               AND p.seller_id IS NOT NULL`;

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

    for (const row of rows) {
      const { img } = row;

      if (img === null) {
        row['img'] = [];
      } else if (typeof img === 'string') {
        row['img'] = img.split(',');
      }
    }

    return rows.map(toProduct).filter(isProduct);
  };
}
