import { Request, Response, Result } from '/opt/core/router';

import {
  ProductListModel,
  ProductModel,
} from '/opt/models/product/ProductModel';
import { Product, ProductInfo } from '/opt/models/product/types';
import NetworkError from '/opt/core/network-error';

export default class ProductController {
  private readonly productModel: ProductModel = new ProductModel();
  private readonly productListModel: ProductListModel = new ProductListModel();

  public addProduct = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    const { body } = request;

    if (!validateProductInformation(body)) {
      return response.throw(NetworkError.UNPROCESSABLE_CONTENT);
    }

    const product: Product = await this.productModel.create(body);

    return response.status(200).send(product);
  };

  public deleteProductById = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    const id = Number(request.params.productId);

    if (!validateProductId(id)) {
      return response.throw(NetworkError.BAD_REQUEST);
    }

    const deleteSuccess: boolean = await this.productModel.delete(id);

    return response.status(200).send(deleteSuccess);
  };

  public getProductById = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    const id = Number(request.params.productId);

    if (!validateProductId(id)) {
      throw NetworkError.BAD_REQUEST;
    }

    const product: Product | null = await this.productModel.read(id);

    if (!product) {
      return response.throw(NetworkError.UNPROCESSABLE_CONTENT);
    }

    return response.status(200).send(product);
  };

  public updateProductById = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    const { info } = request.body;
    const id = Number(request.params.productId);

    if (!validateProductId(id) || !info) {
      return response.throw(NetworkError.BAD_REQUEST);
    }

    if (!validateProductInformation(info)) {
      return response.throw(NetworkError.UNPROCESSABLE_CONTENT);
    }

    const product: Product | null = await this.productModel.update({
      id,
      ...info,
    });

    if (!product) throw NetworkError.UNPROCESSABLE_CONTENT;

    return response.status(200).send(product);
  };

    public getProducts = async (request: Request, response: Response): Promise<Result> => {
        const asc = 'ASCEND';
        const dsc = 'DESCEND';
        const nonExist = 'nonExist';
        const category = request.query?.category || nonExist;
        const search = request.query?.search || nonExist;
        // might be a single value, or an array of multiple columns
        const order_by = request.query?.order_by;
        // Set default to ASCEND
        const order_direction = request.query?.order_direction || asc;
        const page = request.query?.page || 1;
        const limit = request.query?.limit || 10;
        let query = `SELECT * FROM dev.product p`;
        if (search != nonExist) {
            query += ` WHERE p.name LIKE '%${search}%'`;
        }
        if (category != nonExist) {
          if (search != nonExist) {
            query += ` AND`;
          } else {
            query += ` WHERE`;
          }
            const category_id = await this.productListModel.getCategoryId(category);
            query += ` p.category_id=${category_id[0].id}`;
        }
        if (order_by) {
            query += ` ORDER BY`;
            if (Array.isArray(order_by)) {
                // when the ordering is based on multiple columns
                let temp = '';
                for (let i = 0; i < order_by.length; i++) {
                    temp = order_by[i];
                    query += ` ${temp}`;
                }
            }
            else {
                // when the ordering is using one column only
                query += ` ${order_by}`;
            }
            if (order_direction) {
                if (order_direction == asc) {
                    query += ` ASC`;
                }
                else if ((order_direction == dsc)) {
                    query += ` DESC`;
                }
            }
        }
        const offset = limit * (page - 1);
        query += ` LIMIT ${limit} OFFSET ${offset}`;
        query += `;`;
        const productList = await this.productListModel.read(query);
        return response.status(200).send(productList);
    };
    
}

function validateProductId(id) {
  return id && typeof id === 'number' && Number.isInteger(id);
}

function validateProductInformation(info): info is ProductInfo {
  if (!info) return false;

  // required
  const { name, price, totalQuantity } = info;

  if (!name || !price || !totalQuantity) {
    return false;
  }
  if (
    typeof name !== 'string' ||
    typeof price !== 'number' ||
    typeof totalQuantity !== 'number'
  ) {
    return false;
  }
  if (name.length > 200 || !Number.isSafeInteger(totalQuantity)) {
    return false;
  }

  // optional
  const { address } = info;

  if (address && address.length > 255) {
    return false;
  }

  return true;
}
