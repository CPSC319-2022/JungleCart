import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import {Request, Response, Result} from "/opt/common/router";

import ProductController from "@/lambdas/products-lambda/controller";

import * as getProductData from 'tests/events/get-products.json';
import {expect} from "chai";

chai.use(chaiAsPromised);

describe('Unit tests for Products', function () {
    describe('When getting Products', function () {
        it('getting all products', async function () {
            const productController = new ProductController();
            const response = new Response(() => {}, () => {});
            const productList = await productController.getProducts(getProductData, response);
            console.log(productList);

            return expect(productList).to.be.an.instanceof(Array);
        });
    });

    describe('When adding Products', function () {
        return;
    });

    describe('When deleting Products', () => {
        return;
    });
    describe('When updating Products', () => {
        return;
    });
});
