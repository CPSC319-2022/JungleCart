import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

import Model from '/opt/core/Model';
import { RowPacketData } from '/opt/models/product/types/row-packet-data';
import { ProductId } from '/opt/models/product/types/product';
import {
  Bucket,
  File,
  isFile,
  isMultimedia,
  Multimedia,
  MultimediaId,
  toMultimedia,
  Url,
} from '/opt/models/product/types/multimedia';

export class MultimediaModel extends Model {
  public create = async (
    productId: ProductId,
    images: (File | Url)[],
    bucket?: Bucket
  ): Promise<Multimedia[]> => {
    const files: File[] = [];
    let urls: string[] = [];

    images.forEach((image) => {
      if (isFile(image)) files.push(image);
      else urls.push(image.url);
    });

    if (bucket && files) {
      const uploadedImageUrls: string[] = await this.uploadFilesToBucket(
        productId,
        files,
        bucket
      );

      urls = urls.concat(uploadedImageUrls);
    }

    if (!urls.length) return await this.read(productId);

    const sql = `INSERT INTO dev.product_multimedia (product_id, url)
    VALUES ${urls.map((url) => `(${productId}, '${url}')`).join(`, `)};`;

    const okPacket = await this.query(sql);

    return okPacket.affectedRows ? this.read(productId) : [];
  };

  public read = async (productId: ProductId): Promise<Multimedia[]> => {
    const sql = `SELECT * FROM dev.product_multimedia WHERE product_id='${productId}'`;

    const multimedia: RowPacketData[] = await this.query(sql);

    return multimedia ? multimedia.map(toMultimedia).filter(isMultimedia) : [];
  };

  public update = async (
    productId: ProductId,
    images: (File | Url)[],
    multimediaIds: MultimediaId[],
    bucket?: Bucket
  ): Promise<Multimedia[]> => {
    let sql = `DELETE FROM dev.product_multimedia
                     WHERE product_id = ${productId}`;

    if (multimediaIds.length) {
      sql += ` AND id NOT IN (${multimediaIds
        .map((obj) => obj.id)
        .join(', ')})`;
    }

    await this.query(sql);

    return await this.create(productId, images, bucket);
  };

  public delete = async (multimediaIds: MultimediaId[]): Promise<boolean> => {
    const sql = `DELETE FROM dev.product_multimedia
                     WHERE id IN (${multimediaIds
                       .map((obj) => obj.id)
                       .join(', ')})`;

    await this.removeFilesFromBucket(multimediaIds);

    const okPacket = await this.query(sql);

    return Boolean(okPacket.affectedRows);
  };

  private uploadFilesToBucket = async (
    productId: ProductId,
    files: File[],
    bucket: Bucket
  ): Promise<string[]> => {
    const client = new S3Client({
      region: bucket.region,
    });

    const keys: string[] = files.map(() => `${productId}/${uuidv4()}`);

    const uploadPromises = files.map(async (image: File, index: number) => {
      const request: PutObjectCommand = new PutObjectCommand({
        Bucket: bucket.name,
        Key: keys.at(index) ?? '',
        Body: Buffer.from(image.data, 'base64'),
        ContentType: image.type,
      });

      return client.send(request);
    });
    await Promise.all(uploadPromises);

    const uploadedImageUrls: string[] = keys.map((key) => {
      const { name, region } = bucket;
      return `https://${name}.s3.${region}.amazonaws.com/${key}`;
    });

    return uploadedImageUrls;
  };

  private removeFilesFromBucket = async (multimediaIds: MultimediaId[]) => {};
}

export default new MultimediaModel();
