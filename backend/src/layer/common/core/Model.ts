import { MySqlDatabaseApi } from '/opt/types/database';

export default abstract class Model {
  private databaseApi: MySqlDatabaseApi;

  protected database: string;
  protected query: typeof MySqlDatabaseApi.prototype.query;

  constructor(databaseApi: MySqlDatabaseApi) {
    this.databaseApi = databaseApi;
    this.query = databaseApi.query;
    this.database = databaseApi.getDatabase();
  }

  public create?(...info);

  public read?(...info);

  public update?(...info);

  public delete?(...info);
}
