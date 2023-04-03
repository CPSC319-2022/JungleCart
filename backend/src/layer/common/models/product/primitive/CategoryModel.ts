import Model from '/opt/core/Model';
import { Category, toCategory } from '/opt/types/category';

export default class CategoryModel extends Model {
  public read = async (categoryName: string): Promise<Category | undefined> => {
    const sql = `SELECT * FROM ${this.database}.category WHERE name='${categoryName}'`;

    const [category] = await this.query(sql);

    return category ? toCategory(category) : undefined;
  };
}
