import Model from "/opt/common/Model";
import {Product, ProductWithId} from "./types";

export class ProductModel extends Model {

    private camelToSnakeCase(input: string): string {
        return input.replace(
            /[A-Z]/g,
            (match) => `_${match.toLowerCase()}`
        );
    }

    private getColumnNamesAndValuesFromProduct(product: Product): [string[], any[]] {
        const columnNames: string[] = [];
        const values: any[] = [];

        Object.entries(product)
            .forEach(([attribute, value]) => {
                columnNames.push(this.camelToSnakeCase(attribute));
                values.push(value);
            });

        return [columnNames, values];
    }

    public async create(product: Product): Promise<Product> {
        const [columnNames, values] = this.getColumnNamesAndValuesFromProduct(product);

        const columns = columnNames.join(', ');
        const placeholders = columnNames.map(() => '?').join(', ');

        const sql = `INSERT INTO dev.product (${columns})
                     VALUES (${placeholders})`;

        const [result] = await this.query(sql, values);

        return {id: result.insertId, ...product} as ProductWithId;
    }

    public async read(id: number): Promise<Product | null> {
        const sql = `SELECT *
                     FROM dev.product
                     WHERE id = ?`;

        const [rows] = await this.query(sql, [id]);

        return (rows.length) ? rows[0] : null;
    }


    public async update(product: ProductWithId): Promise<Product | null> {
        const {id, ...productInformation} = product;

        const [columnNames, values] = this.getColumnNamesAndValuesFromProduct(productInformation);

        const columns = columnNames.map((columnName) => `${columnName} = ?`).join(', ');

        const sql = `UPDATE dev.product
                     SET ${columns}
                     WHERE id = ?`;

        const [result] = await this.query(sql, values.concat(id));

        return (result.affectedRows) ? await this.read(id) : null;
    }

    public async delete(id: number): Promise<boolean> {
        const sql = `DELETE
                     FROM dev.product
                     WHERE id = ?`;

        const [result] = await this.query(sql, [id]);

        return Boolean(result.affectedRows);
    }
}

export class ProductListModel extends Model {
    public async read(): Promise<Product[]> {
        const sql = `SELECT *
                     FROM dev.product`;

        const [rows] = await this.query(sql);

        return rows;
    }
}
