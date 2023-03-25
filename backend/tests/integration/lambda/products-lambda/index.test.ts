import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import {Response, Result} from "/opt/common/router";

import ProductController from "@/lambdas/products-lambda/controller";

import * as getProductData from 'tests/events/get-products.json';
import {expect} from "chai";

chai.use(chaiAsPromised);

describe('Unit tests for Products', function () {
    describe('When getting Products', function () {
        it('getting all products', async function () {
            const productController: ProductController = new ProductController();
            const response: Response = new Response(() => null, () => null);
            const productList: Result = await productController.getProducts(getProductData, response);

            expect(productList.get()).to.be.an.instanceof(Array);
            expect(productList.get().length).to.be.greaterThan(0);
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
