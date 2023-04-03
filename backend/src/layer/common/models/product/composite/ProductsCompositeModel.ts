import Model from '/opt/core/Model';
import ProductSearchModel from '/opt/models/product/primitive/ProductSearchModel';
import CategoryModel from '/opt/models/product/primitive/CategoryModel';
import MultimediaModel from '/opt/models/product/primitive/MultimediaModel';

import { Query } from '/opt/types/query';
import { Category } from '/opt/types/category';
import { Multimedia } from '/opt/types/multimedia';
import { ProductWithImg } from '/opt/types/product';
import { MySqlDatabaseApi } from "/opt/types/database";

export class ProductsCompositeModel extends Model {
  private readonly productSearchModel: ProductSearchModel;
  private readonly categoryModel: CategoryModel;
  private readonly multimediaModel: MultimediaModel;

  constructor(
    database: MySqlDatabaseApi,
    productListModel?: ProductSearchModel,
    categoryModel?: CategoryModel,
    multimediaModel?: MultimediaModel
  ) {
    super(database);
    this.productSearchModel = productListModel ?? new ProductSearchModel(database);
    this.categoryModel = categoryModel ?? new CategoryModel(database);
    this.multimediaModel = multimediaModel ?? new MultimediaModel(database);
  }

  public read = async (search: Query, categoryName: string | undefined) => {
    const category: Category | undefined = categoryName?.length
      ? await this.categoryModel.read(categoryName)
      : undefined;

    const productList = await this.productSearchModel.read({
      ...search,
      categoryId: category?.id,
    });

    if (!productList) return undefined;

    const productWithImgList = await Promise.all(
      productList.map(async (product) => {
        const multimedia: Multimedia[] | undefined = await this.multimediaModel.read(
          product.id
        );
        const productWithImg: ProductWithImg = {
          ...product,
          img: multimedia ? multimedia.map(({ id, url }) => ({ id, url })) : [],
        };

        return productWithImg;
      })
    );

    return productWithImgList;
  };
}
