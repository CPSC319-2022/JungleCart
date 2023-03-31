import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import Model from '/opt/core/Model';
import { RowDataPacket } from '/opt/models/product/types/query-result';
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
    const urls: string[] = [];

    images.forEach((image) => {
      if (isFile(image)) files.push(image);
      else urls.push(image.url);
    });

    let affectedCount = (await this.insertUrls(productId, urls)).length;

    if (bucket && files.length) {
      const fileUrls = this.getFilesUrls(productId, files, bucket);
      const fileRows = await this.insertFiles(productId, fileUrls);

      const keys = fileRows.map(
        (multimedia) => `${productId}/${multimedia.id}`
      );

      affectedCount += (
        await this.uploadFilesToBucket(productId, files, keys, bucket)
      ).length;
    }

    return affectedCount ? this.read(productId) : [];
  };

  private insertUrls = async (productId: ProductId, urls: string[]) => {
    if (urls.length === 0) return [];

    const insertSQL = `INSERT INTO dev.product_multimedia (product_id, url)
                       VALUES ${urls
                         .map((url) => `(${productId}, '${url}')`)
                         .join(', ')};`;

    const selectSQL = `SELECT *
                       FROM dev.product_multimedia
                       WHERE product_id = ${productId}
                         AND id >= LAST_INSERT_ID();`;

    const [okPacket, rows] = await this.query(insertSQL + selectSQL);

    return rows as any[];
  };

  private insertFiles = async (productId: ProductId, fileUrls: string[]) => {
    if (fileUrls.length === 0) return [];

    const insertSQL = `INSERT INTO dev.product_multimedia (product_id, url)
                       VALUES ${fileUrls
                         .map(
                           (url, index) =>
                             `(${productId}, CONCAT('${url}', LAST_INSERT_ID()+${
                               1 + index
                             }))`
                         )
                         .join(', ')};`;

    const selectSQL = `SELECT *
                       FROM dev.product_multimedia
                       WHERE product_id = ${productId}
                         AND id >= LAST_INSERT_ID();`;

    const [okPacket, rows] = await this.query(insertSQL + selectSQL);

    return rows as any[];
  };

  public read = async (productId: ProductId): Promise<Multimedia[]> => {
    const sql = `SELECT *
                 FROM dev.product_multimedia
                 WHERE product_id = '${productId}'`;

    const multimedia: RowDataPacket[] = await this.query(sql);

    return multimedia ? multimedia.map(toMultimedia).filter(isMultimedia) : [];
  };

  public update = async (
    productId: ProductId,
    images: (File | Url)[],
    multimediaIds: MultimediaId[],
    bucket?: Bucket
  ): Promise<Multimedia[]> => {
    let sql = `DELETE
               FROM dev.product_multimedia
               WHERE product_id = ${productId}`;

    if (multimediaIds.length) {
      sql += ` AND id NOT IN (${multimediaIds
        .map((obj) => obj.id)
        .join(', ')});`;
    }

    await this.query(sql);

    return await this.create(productId, images, bucket);
  };

  public delete = async (
    productId: ProductId,
    multimediaIds: MultimediaId[],
    bucket?: Bucket
  ): Promise<boolean> => {
    const selectSQL = `SELECT id, url
                       FROM dev.product_multimedia
                       WHERE id IN (${multimediaIds
                         .map((obj) => obj.id)
                         .join(', ')});`;

    const deleteSQL = `DELETE
                       FROM dev.product_multimedia
                       WHERE id IN (${multimediaIds
                         .map((obj) => obj.id)
                         .join(', ')})`;

    const [rows] = await this.query(selectSQL + deleteSQL);

    if (bucket) {
      const { name, region } = bucket;
      const multimedia = rows.filter((row: Multimedia) =>
        row.url.startsWith(
          `https://${name}.s3.${region}.amazonaws.com/${productId}/`
        )
      );

      await this.removeFilesFromBucket(productId, multimedia, bucket);
    }

    return Boolean(rows.length);
  };

  private getFilesUrls = (
    productId: ProductId,
    files: File[],
    bucket: Bucket
  ) => {
    return files.map(() => {
      const { name, region } = bucket;
      return `https://${name}.s3.${region}.amazonaws.com/${productId}/`;
    });
  };

  private uploadFilesToBucket = async (
    productId: ProductId,
    files: File[],
    keys: string[],
    bucket: Bucket
  ) => {
    const client = new S3Client({
      region: bucket.region,
    });

    const uploadPromises = files.map(async (image: File) => {
      const request: PutObjectCommand = new PutObjectCommand({
        Bucket: bucket.name,
        Key: keys.shift() ?? '',
        Body: Buffer.from(image.data, 'base64'),
        ContentType: image.type,
      });

      return client.send(request);
    });
    return Promise.all(uploadPromises);
  };

  private removeFilesFromBucket = async (
    productId: ProductId,
    multimediaIds: MultimediaId[],
    bucket: Bucket
  ) => {
    const client = new S3Client({
      region: bucket.region,
    });

    const deletePromises = multimediaIds.map(async (mId: MultimediaId) => {
      const request: DeleteObjectCommand = new DeleteObjectCommand({
        Bucket: bucket.name,
        Key: `${productId}/${mId.id}`,
      });

      return client.send(request);
    });

    return Promise.all(deletePromises);
  };
}

export default new MultimediaModel();
