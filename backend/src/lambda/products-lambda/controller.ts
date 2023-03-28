import { Request, Response, Result } from '/opt/core/Router';
import NetworkError from '/opt/core/network-error';

import ProductModel from '/opt/models/product/ProductModel';
import ProductListModel from '/opt/models/product/ProductListModel';
import CategoryModel from '/opt/models/product/CategoryModel';
import {
  Category,
  isProductInfo, Multimedia,
  Product,
  Search,
} from '/opt/models/product/types';
import MultimediaModel from "/opt/models/product/MultimediaModel";

export default class ProductController {
  private readonly productModel = ProductModel;
  private readonly productListModel = ProductListModel;
  private readonly categoryModel = CategoryModel;
  private readonly multimediaModel = MultimediaModel;

  public addProduct = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    const { body } = request;

    if (!isProductInfo(body)) {
      return response.throw(NetworkError.UNPROCESSABLE_CONTENT);
    }

    const product: Product = await this.productModel.create(body);

    return response.status(200).send(product);
  };

  public deleteProductById = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    const id = Number(request.params?.productId);

    if (!validateProductId(id)) {
      return response.throw(NetworkError.BAD_REQUEST);
    }

    const product: Product | null = await this.productModel.read(id);

    if (!product) {
      return response.throw(NetworkError.BAD_REQUEST);
    }

    const deleteSuccess: boolean = await this.productModel.delete(id);

    return response.status(200).send(deleteSuccess);
  };

  public getProductById = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    const id = Number(request.params?.productId);

    if (!validateProductId(id)) {
      throw NetworkError.BAD_REQUEST;
    }

    const product: Product | null = await this.productModel.read(id);

    if (!product) {
      return response.throw(NetworkError.UNPROCESSABLE_CONTENT);
    }

    const multimedia: Multimedia[] | null = await this.multimediaModel.read(id);
    const images: string[] | undefined = multimedia?.map((media) => media.url);

    return response.status(200).send({...product, img: images});
  };

  public updateProductById = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    const { img, ...info } = request.body;
    const id = Number(request.params?.productId);

    if (!validateProductId(id) || !info) {
      return response.throw(NetworkError.BAD_REQUEST);
    }

    if (!isProductInfo(info)) {
      return response.throw(NetworkError.UNPROCESSABLE_CONTENT);
    }

    const product: Product | null = await this.productModel.update({
      id,
      ...info,
    });

    if (!product) throw NetworkError.UNPROCESSABLE_CONTENT;

    const multimedia: Multimedia[] | null = await this.multimediaModel.update(id, img);
    const images: string[] | undefined = multimedia?.map((media) => media.url);

    return response.status(200).send({...product, img: images});
  };

  public getProducts = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    const category: Category | null = request.query?.category
      ? await this.categoryModel.read(request.query.category)
      : null;

    const filter: Search.Filter = {
      search: request.query?.search,
      categoryId: category?.id,
    };

    const order: Search.Order = {
      by: request.query?.order_by.split(','),
      direction: request.query?.order_direction,
    };

    const pagination: Search.Pagination = {
      page: Number.isInteger(Number(request.query?.page)) ? request.query.page : 1,
      limit: Number.isInteger(Number(request.query?.limit)) ? request.query.limit : 10,
    };

    const productList = await this.productListModel.read(
      filter,
      order,
      pagination
    );

    return response.status(200).send(productList);
  };
}

function validateProductId(id) {
  return id && typeof id === 'number' && Number.isInteger(id);
}
