import {
  RowPacketData,
  toType,
} from '/opt/models/product/types/row-packet-data';
import type = Mocha.utils.type;

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

export function toMultimedia(rowDataPacket: RowPacketData): Multimedia | null {
  return toType<Multimedia>(rowDataPacket, isMultimedia);
}

export type Base64Image = string;

export function isBase64Image(value): value is Base64Image {
  return !!value && typeof value === 'string';
}

export type File = {
  data: Base64Image;
  type: string;
};

export function isFile(value): value is File {
  return (
    !!value &&
    typeof value === 'object' &&
    isBase64Image(value['data']) &&
    !!value['type'] &&
    typeof value['type'] === 'string'
  );
}

export type Url = { url: string };

export function isUrl(value): value is Url {
  return (
    !!value &&
    typeof value === 'object' &&
    !!value['url'] &&
    typeof value['url'] === 'string' &&
    value['url'].startsWith('http')
  );
}

export type MultimediaId = { id: number };

export function isId(value): value is MultimediaId {
  return (
    !!value &&
    typeof value === 'object' &&
    !!value['id'] &&
    typeof value['id'] === 'number'
  );
}

export interface Bucket {
  name: string;
  region: string;
}
