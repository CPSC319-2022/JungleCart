import { DatabaseApi } from '/opt/types/database';

export default abstract class Model {
  private databaseApi: DatabaseApi;

  protected database: string;
  protected query: typeof DatabaseApi.prototype.query;

  constructor(databaseApi: DatabaseApi) {
    this.databaseApi = databaseApi;
    this.query = databaseApi.query;
    this.database = databaseApi.getDatabase();
  }

  public create?(...info);

  public read?(...info);

  public update?(...info);

  public delete?(...info);
}
