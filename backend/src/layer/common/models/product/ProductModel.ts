import Model from '../../core/Model';
import { RowPacketData } from '/opt/models/product/types/row-packet-data';
import {
  Product,
  ProductId,
  ProductInfo,
  toProduct,
} from '/opt/models/product/types/product';

export class ProductModel extends Model {
  public create = async (productInfo: ProductInfo): Promise<Product | null> => {
    const [columnNames, values] =
      ProductModel.getColumnNamesAndValuesFromObject(productInfo);

    const columns = columnNames.join(', ');
    const placeholders = columnNames.map(() => '?').join(', ');

    const sql = `INSERT INTO dev.product (${columns})
                     VALUES (${placeholders})`;

    const okPacket = await this.query(sql, values);

    return okPacket.affectedRows
      ? toProduct({ id: okPacket.insertId, ...productInfo })
      : null;
  };

  public read = async (productId: ProductId): Promise<Product | null> => {
    const sql = `SELECT *
                     FROM dev.product
                     WHERE id = ?`;

    const product: RowPacketData = (await this.query(sql, [productId])).pop();

    return product ? toProduct(product) : null;
  };

  public update = async (
    productId: ProductId,
    productInfo: ProductInfo
  ): Promise<Product | null> => {
    const [columnNames, values] =
      ProductModel.getColumnNamesAndValuesFromObject(productInfo);

    const columns = columnNames
      .map((columnName) => `${columnName} = ?`)
      .join(', ');

    const sql = `UPDATE dev.product
                     SET ${columns}
                     WHERE id = ?`;

    const okPacket = await this.query(sql, values.concat(productId));

    return okPacket.affectedRows ? { id: productId, ...productInfo } : null;
  };

  public delete = async (productId: ProductId): Promise<boolean> => {
    const sql = `DELETE
                     FROM dev.product
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

export default new ProductModel();
