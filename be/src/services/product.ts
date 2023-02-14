import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import axios from 'axios'
import { ProductModel, MockProductModel } from '../models'
import * as model from '../utils/types'
import * as dto from '../utils/types.dto'
import { TokenObj } from '../utils/token'
import errorGenerator from '../utils/errorGenerator'
import dotenv from 'dotenv'
dotenv.config()

class ProductService {
  private mockTest: boolean
  private productModel: typeof ProductModel | typeof MockProductModel

  constructor() {
    console.log('construct product service')
    this.mockTest = false
    this.productModel = this.mockTest ? MockProductModel : ProductModel
  }

  public async addProduct(productDTO: dto.Product) {
    const productExist = await this.doesExist(productDTO)
    return await this.productModel.addProduct(productDTO)
  }

  public async deleteProductById(productId: number) {
    //
  }

  public async getProductInfoById(productId: number) {
    return await this.productModel.getProductInfoById(productId)
  }

  public async getProducts(searchOpt, order, pageOpt) {
    return await this.productModel.getProductsInfo(searchOpt, order, pageOpt)
  }

  public async updateProductInfoById(productId: number) {
    //
  }

  private async doesExist(productDTO: dto.Product) {
    return false
  }
}

export default new ProductService()