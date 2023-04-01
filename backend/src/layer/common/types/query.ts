export type By = string[];

export type Direction = 'ASC' | 'DESC';

export function validateBy(value): value is By {
  return (
    !!value &&
    typeof value === 'object' &&
    value instanceof Array &&
    value.length > 0 &&
    typeof value.at(0) === 'string' &&
    value.every((column) => column !== '')
  );
}

export function validateDirection(value): value is Direction {
  return (
    !!value && typeof value === 'string' && ['ASC', 'DESC'].includes(value)
  );
}

export interface Query {
  search?: string;
  categoryId?: number;
  by?: By;
  direction?: Direction;
  page: number;
  limit: number;
}
