import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';

import { MySqlDatabaseApi } from '/opt/types/database';
import { toCategory } from '/opt/types/category';

import CategoryModel from '/opt/models/product/primitive/CategoryModel';

describe('CategoryModel', () => {
  let mockDatabaseApi: MySqlDatabaseApi;

  beforeEach(() => {
    mockDatabaseApi = new (class extends MySqlDatabaseApi {
      create: SinonStub = sinon.stub();
      delete: SinonStub = sinon.stub();
      getDatabase: SinonStub = sinon.stub();
      query: SinonStub = sinon.stub();
    })();
  });

  describe('#read', () => {
    it('should retrieve a category from the database', async () => {
      const mockCategory = {
        id: 1,
        name: 'Test Category',
        description: 'A category for testing purposes',
      };

      const mockDatabase = 'CategoryModel-#read';

      const stubGetDatabase = mockDatabaseApi.getDatabase as SinonStub;
      const stubQuery = mockDatabaseApi.query as SinonStub;

      stubGetDatabase.returns(mockDatabase);
      stubQuery.resolves([mockCategory]);

      const categoryModel = new CategoryModel(mockDatabaseApi);
      const category = await categoryModel.read(mockCategory.name);

      expect(
        stubQuery.calledOnceWith(
          `SELECT * FROM ${mockDatabase}.category WHERE name='Test Category'`
        )
      ).to.be.true;
      expect(category).to.deep.equal(toCategory(mockCategory));
    });
  });
});
