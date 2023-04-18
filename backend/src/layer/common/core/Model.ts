import mySqlFacade, { MySqlFacade } from '/opt/core/SQLManager';

export default abstract class Model {
  protected sqlFacade: MySqlFacade;

  protected database: string;
  protected query: typeof MySqlFacade.prototype.query;

  constructor(databaseApi?: MySqlFacade) {
    databaseApi ??= mySqlFacade;

    this.sqlFacade = databaseApi;
    this.query = databaseApi.query;
    this.database = databaseApi.getDatabase() || '';
  }

  public create?(...info);

  public read?(...info);

  public update?(...info);

  public delete?(...info);
}
