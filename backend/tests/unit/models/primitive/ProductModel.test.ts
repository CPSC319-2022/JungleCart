import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';

import { MySqlDatabaseApi } from '/opt/types/database';
import { ProductInfo, toProduct } from '/opt/types/product';

import ProductModel from '/opt/models/product/primitive/ProductModel';

describe('ProductModel', () => {
  let mockDatabaseApi: MySqlDatabaseApi;
  let mockDatabase: string;

  const generateRandomInt = () =>
    Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER));
  const generateRandomFloat = () => (Math.random() * 2) ^ 14;

  const queryToRegex = (query: string) =>
    new RegExp(
      '^' + query.replace(/[*.?()]/g, '\\$&').replace(/\s+/g, '\\s+') + '$',
      'i'
    );

  beforeEach(() => {
    mockDatabaseApi = new (class extends MySqlDatabaseApi {
      create: SinonStub = sinon.stub();
      delete: SinonStub = sinon.stub();
      getDatabase: SinonStub = sinon.stub();
      query: SinonStub = sinon.stub();
    })();

    mockDatabase = 'ProductModelTest';

    (mockDatabaseApi.getDatabase as SinonStub).returns(mockDatabase);
  });

  describe('#create', () => {
    it('should create a product in the database', async () => {
      const mockProductInfo: ProductInfo = {
        name: 'Test Product',
        price: generateRandomFloat(),
        totalQuantity: generateRandomInt(),
        sellerId: generateRandomInt(),
        categoryId: generateRandomInt(),
      };

      const stubQuery = mockDatabaseApi.query as SinonStub;
      stubQuery.resolves({ affectedRows: 1, insertId: 1 });

      const productModel = new ProductModel(mockDatabaseApi);
      const product = await productModel.create(mockProductInfo);

      const expectedQuery = `INSERT INTO ${mockDatabase}.product (name, price, total_quantity, seller_id, category_id)
                             VALUES (?, ?, ?, ?, ?)`;
      expect(
        stubQuery.calledWith(
          sinon.match(queryToRegex(expectedQuery)),
          Object.values(mockProductInfo)
        )
      ).to.be.true;
      expect(stubQuery.calledOnce).to.be.true;
      expect(product).to.deep.equal(toProduct({ id: 1, ...mockProductInfo }));
    });
  });

  describe('#read', () => {
    it('should retrieve a product from the database', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: generateRandomFloat(),
        total_quantity: generateRandomInt(),
        seller_id: generateRandomInt(),
        category_id: generateRandomInt(),
        description: 'A product for testing purposes',
      };

      const stubQuery = mockDatabaseApi.query as SinonStub;
      stubQuery.resolves([mockProduct]);

      const productModel = new ProductModel(mockDatabaseApi);
      const product = await productModel.read(mockProduct.id);

      const expectedQuery = `SELECT *
                             FROM ${mockDatabase}.product
                             WHERE id = ?`;
      expect(
        stubQuery.calledWith(sinon.match(queryToRegex(expectedQuery)), [
          mockProduct.id,
        ])
      ).to.be.true;
      expect(product).to.deep.equal(toProduct(mockProduct));
    });
  });

  describe('#update', () => {
    it('should update a product in the database', async () => {
      const mockProductInfo: ProductInfo = {
        name: 'Updated Product Name',
        price: generateRandomFloat(),
        totalQuantity: generateRandomInt(),
        sellerId: generateRandomInt(),
        categoryId: generateRandomInt(),
      };
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: generateRandomFloat(),
        total_quantity: generateRandomInt(),
        seller_id: generateRandomInt(),
        category_id: generateRandomInt(),
        description: 'A product for testing purposes',
      };

      const stubQuery = mockDatabaseApi.query as SinonStub;

      stubQuery.onFirstCall().resolves({ affectedRows: 1 });
      stubQuery
        .onSecondCall()
        .resolves([{ id: mockProduct.id, ...mockProductInfo }]);

      const productModel = new ProductModel(mockDatabaseApi);
      const updatedProduct = await productModel.update(
        mockProduct.id,
        mockProductInfo
      );

      const expectedQueryUpdate = `UPDATE ${mockDatabase}.product
                                   SET name           = ?,
                                       price          = ?,
                                       total_quantity = ?,
                                       seller_id      = ?,
                                       category_id    = ?
                                   WHERE id = ?`;
      expect(
        stubQuery.firstCall.calledWith(
          sinon.match(queryToRegex(expectedQueryUpdate)),
          [...Object.values(mockProductInfo), mockProduct.id]
        )
      ).to.be.true;

      const expectedQuerySelect = `SELECT *
                                   FROM ${mockDatabase}.product
                                   WHERE id = ?`;
      expect(
        stubQuery.secondCall.calledWith(
          sinon.match(queryToRegex(expectedQuerySelect)),
          [mockProduct.id]
        )
      ).to.be.true;

      expect(updatedProduct).to.deep.equal(
        toProduct({ id: 1, ...mockProductInfo })
      );
    });
  });

  describe('#delete', () => {
    it('should delete a product from the database', async () => {
      const mockProductId = 1;
      const stubQuery = mockDatabaseApi.query as SinonStub;

      stubQuery.onFirstCall().resolves({ affectedRows: 1 });

      const productModel = new ProductModel(mockDatabaseApi);
      const isDeleted = await productModel.delete(mockProductId);

      const expectedQuery = `DELETE
                             FROM ${mockDatabase}.product
                             WHERE id = ?`;
      expect(
        stubQuery.firstCall.calledWith(
          sinon.match(queryToRegex(expectedQuery)),
          [mockProductId]
        )
      ).to.be.true;

      expect(isDeleted).to.be.true;
    });

    it('should return false if no product is deleted from the database', async () => {
      const mockProductId = 1;
      const stubQuery = mockDatabaseApi.query as SinonStub;

      stubQuery.onFirstCall().resolves({ affectedRows: 0 });

      const productModel = new ProductModel(mockDatabaseApi);
      const isDeleted = await productModel.delete(mockProductId);

      const expectedQuery = `DELETE
                             FROM ${mockDatabase}.product
                             WHERE id = ?`;
      expect(
        stubQuery.firstCall.calledWith(
          sinon.match(queryToRegex(expectedQuery)),
          [mockProductId]
        )
      ).to.be.true;

      expect(isDeleted).to.be.false;
    });
  });
});
