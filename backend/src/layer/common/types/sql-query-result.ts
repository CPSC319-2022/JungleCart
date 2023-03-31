import { OkPacket, RowDataPacket } from 'mysql2';

export { RowDataPacket, OkPacket };

export function toType<T>(
  rowDataPacket: RowDataPacket,
  validationFunction: (object) => object is T
): T | null {
  if (typeof rowDataPacket !== 'object') return null;
  const fromSnakeToCamelCase = (input: string) =>
    input.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());

  const camelCaseData = copyObjectWithMappedKeys(
    rowDataPacket,
    fromSnakeToCamelCase
  );
  return validationFunction(camelCaseData) ? { ...camelCaseData } : null;
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
