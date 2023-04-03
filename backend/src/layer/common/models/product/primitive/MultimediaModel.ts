import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import Model from '/opt/core/Model';
import { MySqlDatabaseApi, RowDataPacket } from '/opt/types/database';
import { ProductId } from '/opt/types/product';
import {
  Bucket,
  File,
  isFile,
  isMultimedia,
  Multimedia,
  MultimediaId,
  toMultimedia,
  Url,
} from '/opt/types/multimedia';

export default class MultimediaModel extends Model {
  private readonly bucket?: Bucket;

  constructor(database: MySqlDatabaseApi, bucket?: Bucket) {
    super(database);
    this.bucket = bucket;
  }

  public create = async (
    productId: ProductId,
    images: (File | Url)[]
  ): Promise<Multimedia[]> => {
    const files: File[] = [];
    const urls: string[] = [];

    images.forEach((image) => {
      if (isFile(image)) files.push(image);
      else urls.push(image.url);
    });

    let affectedRows: boolean = !!(await this.insertUrls(productId, urls))
      .length;

    if (this.bucket && files.length) {
      const { name, region } = this.bucket;
      const base = `https://${name}.s3.${region}.amazonaws.com/${productId}/`;

      const fileRows = await this.insertFiles(productId, base, files.length);

      const keys = fileRows.map(
        (multimedia) => `${productId}/${multimedia.id}`
      );

      affectedRows ||= await this.uploadFilesToBucket(productId, files, keys);
    }

    return affectedRows ? this.read(productId) : [];
  };

  private insertUrls = async (productId: ProductId, urls: string[]) => {
    if (urls.length === 0) return [];

    const insertSQL = `INSERT INTO ${
      this.database
    }.product_multimedia (product_id, url)
                       VALUES ${urls
                         .map((url) => `(${productId}, '${url}')`)
                         .join(', ')};`;

    const selectSQL = `SELECT *
                       FROM ${this.database}.product_multimedia
                       WHERE product_id = ${productId}
                         AND id >= LAST_INSERT_ID();`;

    const [okPacket, rows] = await this.query(insertSQL + selectSQL);

    return rows as any[];
  };

  private insertFiles = async (
    productId: ProductId,
    base: string,
    count: number
  ) => {
    if (!count) return [];

    const insertSQL = `INSERT INTO ${
      this.database
    }.product_multimedia (product_id, url)
                       VALUES ${[...Array(count).keys()]
                         .map(() => `(${productId}, '')`)
                         .join(', ')};`;

    const selectSQL = `SELECT id
                       FROM ${this.database}.product_multimedia
                       WHERE product_id = ${productId}
                         AND id >= LAST_INSERT_ID();`;

    const [okPacket, rows] = await this.query(insertSQL + selectSQL);

    const insertedIds = rows.map((obj) => obj.id);
    const updateUrlSql = `UPDATE ${this.database}.product_multimedia
                          SET url = CASE id ${insertedIds
                            .map(
                              (id) =>
                                ` WHEN ${id} THEN '${
                                  base + id
                                }'`
                            ).join('\n')}
                              END
                              WHERE id IN (${insertedIds.join(', ')});`;

    await this.query(updateUrlSql);

    return rows as any[];
  };

  public read = async (productId: ProductId): Promise<Multimedia[]> => {
    const sql = `SELECT *
                 FROM ${this.database}.product_multimedia
                 WHERE product_id = '${productId}'`;

    const multimedia: RowDataPacket[] = await this.query(sql);

    return multimedia ? multimedia.map(toMultimedia).filter(isMultimedia) : [];
  };

  public update = async (
    productId: ProductId,
    images: (File | Url)[],
    multimediaIds: MultimediaId[]
  ): Promise<Multimedia[]> => {
    let sql = `DELETE
               FROM ${this.database}.product_multimedia
               WHERE product_id = ${productId}`;

    if (multimediaIds.length) {
      sql += ` AND id NOT IN (${multimediaIds
        .map((obj) => obj.id)
        .join(', ')});`;
    }

    await this.query(sql);

    return await this.create(productId, images);
  };

  public delete = async (
    productId: ProductId,
    multimediaIds: MultimediaId[]
  ): Promise<boolean> => {
    const selectSQL = `SELECT id, url
                       FROM ${this.database}.product_multimedia
                       WHERE id IN (${multimediaIds
                         .map((obj) => obj.id)
                         .join(', ')});`;

    const deleteSQL = `DELETE
                       FROM ${this.database}.product_multimedia
                       WHERE id IN (${multimediaIds
                         .map((obj) => obj.id)
                         .join(', ')})`;

    const [rows] = await this.query(selectSQL + deleteSQL);

    if (this.bucket) {
      const { name, region } = this.bucket;
      const multimedia = rows.filter((row: Multimedia) =>
        row.url.startsWith(
          `https://${name}.s3.${region}.amazonaws.com/${productId}/`
        )
      );

      await this.removeFilesFromBucket(productId, multimedia);
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
    keys: string[]
  ): Promise<boolean> => {
    if (!this.bucket) return false;

    const client = new S3Client({
      region: this.bucket.region,
    });

    const uploadPromises = files.map((image: File) => {
      const request: PutObjectCommand = new PutObjectCommand({
        Bucket: this.bucket!.name,
        Key: keys.shift() ?? '',
        Body: Buffer.from(image.data, 'base64'),
        ContentType: image.type,
      });

      return client.send(request);
    });

    await Promise.all(uploadPromises);
    return true;
  };

  private removeFilesFromBucket = async (
    productId: ProductId,
    multimediaIds: MultimediaId[]
  ): Promise<boolean> => {
    if (!this.bucket) return false;

    const client = new S3Client({
      region: this.bucket.region,
    });

    const deletePromises = multimediaIds.map((mId: MultimediaId) => {
      const request: DeleteObjectCommand = new DeleteObjectCommand({
        Bucket: this.bucket!.name,
        Key: `${productId}/${mId.id}`,
      });

      return client.send(request);
    });

    await Promise.all(deletePromises);
    return true;
  };
}
