import Model from '/opt/core/Model';
import { ProductSearchModel } from '/opt/models/product/ProductSearchModel';
import { CategoryModel } from '/opt/models/product/CategoryModel';
import { MultimediaModel } from '/opt/models/product/MultimediaModel';
import { Query } from '/opt/types/query';
import { Category } from '/opt/types/category';
import { Multimedia } from '/opt/types/multimedia';
import { ProductWithImg } from '/opt/types/product';

export class ProductsCompositeModel extends Model {
  private readonly productSearchModel: ProductSearchModel;
  private readonly categoryModel: CategoryModel;
  private readonly multimediaModel: MultimediaModel;

  constructor(
    productListModel: ProductSearchModel,
    categoryModel: CategoryModel,
    multimediaModel: MultimediaModel
  ) {
    super();
    this.productSearchModel = productListModel;
    this.categoryModel = categoryModel;
    this.multimediaModel = multimediaModel;
  }

  public read = async (search: Query, categoryName: string | undefined) => {
    const category: Category | null = categoryName?.length
      ? await this.categoryModel.read(categoryName)
      : null;

    const productList = await this.productSearchModel.read({
      ...search,
      categoryId: category?.id,
    });

    if (!productList) return null;

    const productWithImgList = await Promise.all(
      productList.map(async (product) => {
        const multimedia: Multimedia[] | null = await this.multimediaModel.read(
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
