import { OkPacket, RowDataPacket } from 'mysql2';
import * as mysql from "mysql2/promise";

export { RowDataPacket, OkPacket };

export function toType<T>(
  rowDataPacket: RowDataPacket,
  validationFunction: (object) => object is T
): T | undefined {
  if (typeof rowDataPacket !== 'object') return undefined;
  const fromSnakeToCamelCase = (input: string) =>
    input.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());

  const camelCaseData = copyObjectWithMappedKeys(
    rowDataPacket,
    fromSnakeToCamelCase
  );
  return validationFunction(camelCaseData) ? { ...camelCaseData } : undefined;
}

function copyObjectWithMappedKeys(
  obj: object,
  map: (input: string) => string
): object {
  const keys: string[] = Object.keys(obj);
  const newObj: object = {};

  keys.forEach((key) => {
    newObj[map(key)] = obj[key];
  });

  return newObj;
}

export abstract class DatabaseApi {
  protected pool: mysql.Pool;
  public abstract createConnectionPool: (...params) => void;
  public abstract query: (query: string, set?: unknown[]) => Promise<any>;

  public abstract endPool: () => Promise<void>;

  public abstract getDatabase: () => string;
}

export interface ConnectionParameters {
  hostname: string;
  username: string;
  password: string;
  port: number;
  database: string;
}
