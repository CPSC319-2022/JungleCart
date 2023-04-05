import Model from '/opt/core/Model';
import ProductModel from '/opt/models/product/primitive/ProductModel';
import MultimediaModel from '/opt/models/product/primitive/MultimediaModel';

import {
  Product,
  ProductId,
  ProductInfo,
  ProductWithImg,
} from '/opt/types/product';
import {
  Bucket,
  Multimedia,
  Url,
  File,
  MultimediaId,
} from '/opt/types/multimedia';
import { MySqlDatabaseApi } from '/opt/types/database';

export class ProductByIdCompositeModel extends Model {
  private readonly productModel: ProductModel;
  private readonly multimediaModel: MultimediaModel;

  constructor(
    database: MySqlDatabaseApi,
    bucket?: Bucket,
    productModel?: ProductModel,
    multimediaModel?: MultimediaModel
  ) {
    super(database);
    this.productModel = productModel ?? new ProductModel(database);
    this.multimediaModel =
      multimediaModel ?? new MultimediaModel(database, bucket);
  }

  public create = async (
    productInfo: ProductInfo,
    images: (File | Url)[]
  ): Promise<ProductWithImg | undefined> => {
    const product: Product | undefined = await this.productModel.create(
      productInfo
    );

    if (!product) {
      return undefined;
    }

    const multimedia: Multimedia[] = await this.multimediaModel.create(
      product.id,
      images
    );

    const productWithImg: ProductWithImg = {
      ...product,
      img: multimedia.map(({ id, url }) => ({ id, url })),
    };

    return productWithImg;
  };

  public read = async (
    productId: ProductId
  ): Promise<ProductWithImg | undefined> => {
    const product: Product | undefined = await this.productModel.read(
      productId
    );

    if (!product) {
      return undefined;
    }

    const multimedia: Multimedia[] = await this.multimediaModel.read(productId);

    const productWithImg: ProductWithImg = {
      ...product,
      img: multimedia.map(({ id, url }) => ({ id, url })),
    };

    return productWithImg;
  };

  public update = async (
    productId: ProductId,
    productInfo: Partial<ProductInfo>,
    updateImages: boolean,
    images: (File | Url)[],
    ids: MultimediaId[]
  ): Promise<Product | undefined> => {
    const product: Product | undefined = await this.productModel.update(
      productId,
      productInfo
    );

    if (!product) {
      return undefined;
    }

    const multimedia: Multimedia[] = updateImages
      ? await this.multimediaModel.update(productId, images, ids)
      : await this.multimediaModel.read(productId);

    const productWithImg: ProductWithImg = {
      ...product,
      img: multimedia.map(({ id, url }) => ({ id, url })),
    };

    return productWithImg;
  };

  public delete = async (productId: ProductId) => {
    const multimedia: Multimedia[] = await this.multimediaModel.read(productId);

    if (multimedia.length) {
      await this.multimediaModel.delete(productId, multimedia);
    }

    const productDeleted = await this.productModel.delete(productId);

    return productDeleted;
  };
}
