import Model from '/opt/core/Model';
import { Category, toCategory } from '/opt/models/product/types';

export class CategoryModel extends Model {
  read = async (categoryName: string): Promise<Category | null> => {
    const sqlQuery = `SELECT * FROM dev.category WHERE name='${categoryName}'`;

    const [category] = await this.query(sqlQuery);

    return category ? toCategory(category) : null;
  };
}

export default new CategoryModel();
