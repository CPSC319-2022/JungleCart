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

export abstract class MySqlDatabaseApi {
  protected pool: mysql.Pool | undefined = undefined;
  public abstract create: (...params) => boolean;
  public abstract query: (query: string, set?: unknown[]) => Promise<any>;

  public abstract delete: () => Promise<boolean>;

  public abstract getDatabase: () => string;
}

export interface ConnectionParameters {
  hostname: string;
  username: string;
  password: string;
  port: number;
  database: string;
}

export function isConnectionParameters(value): value is ConnectionParameters {
  return (
    !!value &&
    typeof value === 'object' &&
    !!value['hostname'] &&
    typeof value['hostname'] === 'string' &&
    !!value['username'] &&
    typeof value['username'] === 'string' &&
    !!value['password'] &&
    typeof value['password'] === 'string' &&
    !!value['port'] &&
    typeof value['port'] === 'number' &&
    !!value['database'] &&
    typeof value['database'] === 'string'
  );
}
