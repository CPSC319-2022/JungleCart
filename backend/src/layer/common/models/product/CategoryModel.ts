import Model from '/opt/core/Model';
import { Category, toCategory } from '/opt/models/product/types';

export class CategoryModel extends Model {
  public read = async (categoryName: string): Promise<Category | null> => {
    const sql = `SELECT * FROM dev.category WHERE name='${categoryName}'`;

    const [category] = await this.query(sql);

    return category ? toCategory(category) : null;
  };
}

export default new CategoryModel();
