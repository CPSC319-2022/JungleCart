export function toType<T>(
  rowDataPacket: object,
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

export interface ConnectionParameters {
  hostname: string;
  username: string;
  password: string;
  port: number;
  database: string;
}

export function isConnectionParameters(value): value is ConnectionParameters {
  return (
    typeof value === 'object' &&
    typeof value['hostname'] === 'string' &&
    typeof value['username'] === 'string' &&
    typeof value['password'] === 'string' &&
    typeof value['port'] === 'number' &&
    typeof value['database'] === 'string'
  );
}
