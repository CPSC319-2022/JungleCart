import Model from "/opt/core/Model";

import {toProduct} from "/opt/models/product/ProductModel";
import {Product, Search} from "/opt/models/product/types";

export class ProductListModel extends Model {
    read = async (filter: Search.Filter, order: Search.Order, pagination: Search.Pagination): Promise<Product[] | null> => {
        let query = `SELECT *
                     FROM dev.product p`;

        const {search, categoryId} = filter;

        if (search || categoryId) query += ` WHERE `;

        if (search) query += `p.name LIKE '%${search}%'`;

        if (search && categoryId) query += ` AND `;

        if (categoryId) {
            query += `p.category_id=${categoryId}`;
        }

        const {by, direction} = order;

        if (by) {
            query += ` ORDER BY ${by.map((column) => `${column} ${direction}`).join(`, `)}`;
        }

        const {limit, page} = pagination;

        const offset = (page - 1) * limit;
        query += ` LIMIT ${limit} OFFSET ${offset}`;

        const rows = await this.query(query);
        return !!rows ? rows.map(toProduct) : null;
    };
}

export default new ProductListModel();
