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
    this.mockTest = true
    this.productModel = this.mockTest ? MockProductModel : ProductModel
  }

  public async addProduct() {
    //
  }

  public async deleteProductById(productId: number) {
    //
  }

  public async getProductInfoById(productId: number) {
    return await this.productModel.getProductInfoById(productId)
  }

  public async getProducts(searchOpt, order, pageOpt) {
    console.log('::: getProduct in Service')
    return await this.productModel.getProductsInfo(searchOpt, order, pageOpt)
  }

  public async updateProductInfoById(productId: number) {
    //
  }

  private async doesExist(productId: number) {
    return false
  }
}

export default new ProductService()