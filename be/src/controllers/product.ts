import express from 'express'
import { Request, Response } from 'express'
import * as dto from '../utils/types.dto'
import * as model from '../utils/types'
import dotenv from 'dotenv'
dotenv.config()
import { ProductService } from '../service'
import errorGenerator from '../utils/errorGenerator'

const productErrMsg = {
  invalidInput: 'INVALID_INPUT: product info is not valid',
  idNotExist: 'ID NOT EXIST',
}

class ProductController {
  constructor() {
    console.log('product controller constructor')
  }

  public async addProduct(req: Request, res: Response) {
    //
    const productDTO: dto.Product = req.body
    if (!this.isProductInputValid(productDTO)) {
      errorGenerator({
        message: productErrMsg.invalidInput,
        statusCode: 422,
      })
    }
    const productId = await ProductService.addProduct(productDTO)
    res.status(201).json({ id: productId })
  }

  public async deleteProductById(req: Request, res: Response) {
    const productId = Number(req.params.productId)
    const rst = await ProductService.deleteProductById(productId)
    if (!rst) {
      errorGenerator({ message: productErrMsg.idNotExist, statusCode: 404 })
    }
    res.status(201).json({ message: 'product deleted' })
  }

  public async getProductInfoById(req: Request, res: Response) {
    const productId = Number(req.params.productId)
    const product = await ProductService.getProductInfoById(productId)
    res.status(200).json({ product })
  }

  public async updateProductInfoById(req: Request, res: Response) {
    const productDTO: dto.Product = req.body
    if (!this.isProductInputValid(productDTO)) {
      errorGenerator({ message: productErrMsg.invalidInput, statusCode: 422 })
    }
    await ProductService.updateProductInfoById(req.params['id'].slice(1), productDTO)
    res.status(201).json({ message: 'product updated' })
  }

  public async getProductsInfo(req: Request, res: Response) {
    console.log('::: get Products in Controller')
    const searchParams = new URLSearchParams(<any>req.query)
    const searchOpt = searchParams.get('search')
    const order = searchParams.get('order')
    const page = searchParams.get('page')
    const limit = searchParams.get('limit')
    const products = await ProductService.getProducts(searchOpt, order, {
      page,
      limit,
    })
    console.log('order : ', order)
    console.log('search : ', searchOpt)
    console.log('page : ', page)
    res.status(200).json({ products })
  }

  private async isProductInputValid(productDTO: dto.Product) {
    // TODO
    return true
  }
}

export default new ProductController()
