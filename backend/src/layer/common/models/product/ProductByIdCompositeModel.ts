import Model from '/opt/core/Model';
import { ProductModel } from '/opt/models/product/ProductModel';
import { MultimediaModel } from '/opt/models/product/MultimediaModel';
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

export class ProductByIdCompositeModel extends Model {
  private readonly productModel: ProductModel;
  private readonly multimediaModel: MultimediaModel;
  private readonly bucket?: Bucket;

  constructor(
    productModel: ProductModel,
    multimediaModel: MultimediaModel,
    bucket?: Bucket
  ) {
    super();
    this.productModel = productModel;
    this.multimediaModel = multimediaModel;
    this.bucket = bucket;
  }

  public create = async (
    productInfo: ProductInfo,
    images: (File | Url)[]
  ): Promise<ProductWithImg | null> => {
    const product: Product | null = await this.productModel.create(productInfo);

    if (!product) {
      return null;
    }

    const multimedia: Multimedia[] = await this.multimediaModel.create(
      product.id,
      images,
      this.bucket
    );

    const productWithImg: ProductWithImg = {
      ...product,
      img: multimedia.map(({ id, url }) => ({ id, url })),
    };

    return productWithImg;
  };

  public read = async (
    productId: ProductId
  ): Promise<ProductWithImg | null> => {
    const product: Product | null = await this.productModel.read(productId);

    if (!product) {
      return null;
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
    productInfo: ProductInfo,
    updateImages: boolean,
    images: (File | Url)[],
    ids: MultimediaId[]
  ): Promise<Product | null> => {
    const product: Product | null = await this.productModel.update(
      productId,
      productInfo
    );

    if (!product) {
      return null;
    }

    const multimedia: Multimedia[] = updateImages
      ? await this.multimediaModel.update(productId, images, ids, this.bucket)
      : [];

    const productWithImg: ProductWithImg = {
      ...product,
      img: multimedia.map(({ id, url }) => ({ id, url })),
    };

    return productWithImg;
  };

  public delete = async (productId: ProductId) => {
    const multimedia: Multimedia[] | null = await this.multimediaModel.read(
      productId
    );

    if (multimedia.length) {
      await this.multimediaModel.delete(productId, multimedia, this.bucket);
    }

    const productDeleted = await this.productModel.delete(productId);

    return productDeleted;
  };
}