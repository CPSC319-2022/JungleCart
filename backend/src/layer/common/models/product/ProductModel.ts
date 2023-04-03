import Model from '../../core/Model';
import { Product, ProductId, ProductInfo, toProduct } from '/opt/types/product';

export default class ProductModel extends Model {
  public create = async (
    productInfo: ProductInfo
  ): Promise<Product | undefined> => {
    const [columnNames, values] =
      ProductModel.getColumnNamesAndValuesFromObject(productInfo);

    const columns = columnNames.join(', ');
    const placeholders = columnNames.map(() => '?').join(', ');

    const sql = `INSERT INTO ${this.database}.product (${columns})
                 VALUES (${placeholders})`;

    const okPacket = await this.query(sql, values);

    return okPacket.affectedRows
      ? toProduct({ id: okPacket.insertId, ...productInfo })
      : undefined;
  };

  public read = async (productId: ProductId): Promise<Product | undefined> => {
    const sql = `SELECT *
                 FROM ${this.database}.product
                 WHERE id = ?`;

    const rowDataPacket = (await this.query(sql, [productId])).pop();

    return rowDataPacket ? toProduct(rowDataPacket) : undefined;
  };

  public update = async (
    productId: ProductId,
    productInfo: Partial<ProductInfo>
  ): Promise<Product | undefined> => {
    const [columnNames, values] =
      ProductModel.getColumnNamesAndValuesFromObject(productInfo);

    const columns = columnNames
      .map((columnName) => `${columnName} = ?`)
      .join(', ');

    const sql = `UPDATE ${this.database}.product
                 SET ${columns}
                 WHERE id = ?`;

    const okPacket = await this.query(sql, values.concat(productId));

    return okPacket.affectedRows ? await this.read(productId) : undefined;
  };

  public delete = async (productId: ProductId): Promise<boolean> => {
    const sql = `DELETE
                 FROM ${this.database}.product
                 WHERE id = ?`;

    const okPacket = await this.query(sql, [productId]);

    return Boolean(okPacket.affectedRows);
  };

  private static getColumnNamesAndValuesFromObject = (
    obj: object
  ): [string[], unknown[]] => {
    const [columnNames, values] = [Object.keys(obj), Object.values(obj)];
    const camelCaseColumnNames = columnNames.map((name) =>
      name.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
    );

    return [camelCaseColumnNames, values];
  };
}
