import { Request, Response, Result } from '/opt/core/Router';
import NetworkError from '/opt/core/NetworkError';

import { ProductByIdCompositeModel } from '/opt/models/product/composite/ProductByIdCompositeModel';
import { ProductsCompositeModel } from '/opt/models/product/composite/ProductsCompositeModel';
import {
  isOptionalProductInfo,
  isProductId,
  isProductInfo,
  Product,
  ProductId,
  ProductWithImg,
} from '/opt/types/product';
import { Query, validateBy, validateDirection } from '/opt/types/query';
import {
  File,
  MultimediaId,
  isFile,
  isId,
  isUrl,
  Url,
  isImg,
} from '/opt/types/multimedia';

class ProductController {
  private readonly productByIdCompositeModel?: ProductByIdCompositeModel;
  private readonly productsCompositeModel?: ProductsCompositeModel;

  constructor(
    ProductByIdCompositeModel?: ProductByIdCompositeModel,
    productsCompositeModel?: ProductsCompositeModel
  ) {
    this.productByIdCompositeModel = ProductByIdCompositeModel;
    this.productsCompositeModel = productsCompositeModel;
  }

  public addProduct = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    if (!this.productByIdCompositeModel) {
      return response.throw(NetworkError.INTERNAL_SERVER);
    }

    const { img, ...info } = request.body;

    if (!isProductInfo(info)) {
      return response.throw(NetworkError.UNPROCESSABLE_CONTENT);
    }

    if (img && !isImg(img)) {
      return response.throw(NetworkError.UNPROCESSABLE_CONTENT);
    }

    const images: (File | Url)[] =
      img?.filter((obj) => isFile(obj) || isUrl(obj)) ?? [];

    const productWithIdAndImg: ProductWithImg | undefined =
      await this.productByIdCompositeModel.create(info, images);

    if (!productWithIdAndImg) {
      return response.throw(NetworkError.BAD_REQUEST);
    }

    return response.status(201).send(productWithIdAndImg);
  };

  public getProductById = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    if (!this.productByIdCompositeModel) {
      return response.throw(NetworkError.INTERNAL_SERVER);
    }

    const id: ProductId = Number(request.params?.productId);

    if (!isProductId(id)) {
      return response.throw(NetworkError.UNPROCESSABLE_CONTENT);
    }

    const product: Product | undefined =
      await this.productByIdCompositeModel.read(id);

    if (!product) {
      return response.throw(NetworkError.NOT_FOUND);
    }

    return response.status(200).send(product);
  };

  public updateProductById = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    if (!this.productByIdCompositeModel) {
      return response.throw(NetworkError.INTERNAL_SERVER);
    }

    const { img, ...info } = request.body;
    const id: ProductId = Number(request.params?.productId);

    if (!isProductId(id)) {
      return response.throw(NetworkError.BAD_REQUEST);
    }

    if (!isOptionalProductInfo(info)) {
      return response.throw(NetworkError.UNPROCESSABLE_CONTENT);
    }

    const images: (File | Url)[] = [];
    const ids: MultimediaId[] = [];

    img?.forEach((obj) => {
      if (isFile(obj) || isUrl(obj)) {
        images.push(obj);
      } else if (isId(obj)) {
        ids.push(obj);
      }
    });

    const product: Product | undefined =
      await this.productByIdCompositeModel.update(id, info, Boolean(img), images, ids);

    if (!product) throw NetworkError.UNPROCESSABLE_CONTENT;

    return response.status(200).send(product);
  };

  public deleteProductById = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    if (!this.productByIdCompositeModel) {
      return response.throw(NetworkError.INTERNAL_SERVER);
    }

    const id: ProductId = Number(request.params?.productId);

    if (!isProductId(id)) {
      return response.throw(NetworkError.UNPROCESSABLE_CONTENT);
    }

    const deleteSuccess: boolean = await this.productByIdCompositeModel.delete(
      id
    );

    if (!deleteSuccess) {
      return response.throw(NetworkError.BAD_REQUEST);
    }

    return response.status(200).send(deleteSuccess);
  };

  public getProducts = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    if (!this.productsCompositeModel) {
      return response.throw(NetworkError.INTERNAL_SERVER);
    }

    const { search, category, order_by, order_direction, page, limit } =
      request?.query;

    const splitOrderBy = order_by ? order_by.split(',') : undefined;

    const query: Query = {
      search: search,
      by: validateBy(splitOrderBy) ? splitOrderBy : undefined,
      direction: validateDirection(order_direction)
        ? order_direction
        : undefined,
      page: Number.isInteger(Number(page)) ? page : 1,
      limit: Number.isInteger(Number(limit)) ? limit : 12,
    };

    const productList = await this.productsCompositeModel.read(query, category);

    return response.status(200).send(productList);
  };
}

export default ProductController;
