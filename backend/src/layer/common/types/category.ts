export interface Category {
  id: number;
  name: string;
}

export function isCategory(value): value is Category {
  return (
    typeof value === 'object' &&
    typeof value['id'] === 'number' &&
    Number.isInteger(value['id']) &&
    typeof value['name'] === 'string' &&
    value['name'].length <= 100
  );
}

export function toCategory(value): Category | undefined {
  return isCategory(value) ? { id: value.id, name: value.name } : undefined;
}
