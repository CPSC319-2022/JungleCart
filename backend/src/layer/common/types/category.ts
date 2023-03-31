export interface Category {
  id: number;
  name: string;
}

export function isCategory(value): value is Category {
  return (
    value &&
    typeof value === 'object' &&
    value['id'] &&
    typeof value['id'] === 'number' &&
    Number.isInteger(value['id']) &&
    value['name'] &&
    typeof value['name'] === 'string' &&
    value['name'].length <= 100
  );
}

export function toCategory(value): Category | null {
  return isCategory(value) ? { id: value.id, name: value.name } : null;
}
