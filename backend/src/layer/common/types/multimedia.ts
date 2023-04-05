import { RowDataPacket, toType } from '/opt/types/database';

export interface Multimedia {
  id: number;
  productId: number;
  url: string;
}

export function isMultimedia(value): value is Multimedia {
  return (
    value &&
    typeof value === 'object' &&
    value['id'] &&
    typeof value['id'] === 'number' &&
    Number.isInteger(value['id']) &&
    value['productId'] &&
    typeof value['productId'] === 'number' &&
    Number.isInteger(value['productId']) &&
    value['url'] &&
    typeof value['url'] === 'string' &&
    value['url'].length <= 200
  );
}

export function toMultimedia(
  rowDataPacket: RowDataPacket
): Multimedia | undefined {
  return toType<Multimedia>(rowDataPacket, isMultimedia);
}

export type Base64Image = string;

export function isBase64Image(value): value is Base64Image {
  return typeof value === 'string' && value.length > 0;
}

export type File = {
  data: Base64Image;
  type: string;
};

export function isFile(value): value is File {
  return (
    typeof value === 'object' &&
    isBase64Image(value['data']) &&
    typeof value['type'] === 'string'
  );
}

export type Url = { url: string };

export function isUrl(value): value is Url {
  return typeof value === 'object' && typeof value['url'] === 'string';
}

export type MultimediaId = { id: number };

export function isId(value): value is MultimediaId {
  return typeof value === 'object' && typeof value['id'] === 'number';
}

export type MultimediaUploaded = MultimediaId & { uploaded: boolean };

export function isImg(value) {
  return (
    typeof value === 'object' &&
    value instanceof Array &&
    (!value.length || value.every((i) => isFile(i) || isUrl(i)))
  );
}

export interface Bucket {
  name: string;
  region: string;
}

export function isBucket(value): value is Bucket {
  return (
    typeof value === 'object' &&
    typeof value['name'] === 'string' &&
    typeof value['region'] === 'string'
  );
}
