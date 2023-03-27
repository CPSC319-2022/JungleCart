import Model from "../../core/Model";
import {Product} from "./types";

export class ProductModel extends Model {
    public create = async (product: Product): Promise<Product> => {
        const [columnNames, values] = getColumnNamesAndValuesFromProduct(product);

        const columns = columnNames.join(', ');
        const placeholders = columnNames.map(() => '?').join(', ');

        const sql = `INSERT INTO dev.product (${columns})
                     VALUES (${placeholders})`;

        const [result] = await this.query(sql, values);

        return toProduct({id: result.insertId, ...product});
    };

    public read = async (id: number): Promise<Product | null> => {
        const sql = `SELECT *
                     FROM dev.product
                     WHERE id = ?`;

        const [product] = await this.query(sql, [id]);

        return product ? toProduct(product) : null;
    };

    public update = async (product: { id } & Product): Promise<Product | null> => {
        const {id, ...productInformation} = product;

        const [columnNames, values] = getColumnNamesAndValuesFromProduct(productInformation);

        const columns = columnNames.map((columnName) => `${columnName} = ?`).join(', ');

        const sql = `UPDATE dev.product
                     SET ${columns}
                     WHERE id = ?`;

        const [result] = await this.query(sql, values.concat(id));

        return (result.affectedRows) ? await this.read(id) : null;
    };

    public delete = async (id: number): Promise<boolean> => {
        const sql = `DELETE
                     FROM dev.product
                     WHERE id = ?`;

        const [result] = await this.query(sql, [id]);

        return Boolean(result.affectedRows);
    };
}

export class ProductListModel extends Model {
    public read = async (): Promise<Product[]> => {
        const sql = `SELECT *
                     FROM dev.product`;

        const rows = await this.query(sql) as never[];

        return rows.map(toProduct);
    };
}

function fromCamelToSnakeCase(input: string) {
    return input.replace(
        /[A-Z]/g,
        (match) => `_${match.toLowerCase()}`
    );
}

function fromSnakeToCamelCase(input: string) {
    return input.replace(
        /_([a-z])/g,
        (match, letter) => letter.toUpperCase()
    );
}

function copyObjectWithMappedKeys(obj: object, map: (input: string) => string): object {
    const keys: string[] = Object.keys(obj);
    const newObj: object = {};

    keys.forEach(key => {
        newObj[map(key)] = obj[key];
    });

    return newObj;
}

function getColumnNamesAndValuesFromProduct(product: Product): [string[], any[]] {
    const [columnNames, values] = [Object.keys(product), Object.values(product)];
    const camelCaseColumnNames = columnNames.map(fromCamelToSnakeCase);

    return [camelCaseColumnNames, values];
}

function toProduct(rowDataPacket): Product {
    const camelCaseData = copyObjectWithMappedKeys(rowDataPacket, fromSnakeToCamelCase);
    return {...camelCaseData} as Product;
}
