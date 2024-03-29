import * as mysql from '/opt/nodejs/node_modules/mysql2/promise';
import { ConnectionParameters, MySqlDatabaseApi } from '/opt/types/database';

const defaultConfig: ConnectionParameters = {
  hostname: 'sqldb.cyg4txabxn5r.us-west-2.rds.amazonaws.com',
  username: 'admin',
  password: '',
  port: 3306,
  database: 'dev',
};

const testConfig: ConnectionParameters = {
  ...defaultConfig,
  database: 'test',
};

export class MySqlPoolDatabaseApi extends MySqlDatabaseApi {
  private connectionParameters: ConnectionParameters;
  private VERBOSE = false;

  public create = (
    connectionParameters?: ConnectionParameters,
    test = false
  ): boolean => {
    this.VERBOSE = test;

    this.VERBOSE && console.debug('test ::: ', test);

    connectionParameters ??= defaultConfig;

    this.connectionParameters = test ? testConfig : connectionParameters;

    const { hostname, username, database, password, port } =
      this.connectionParameters;

    if (this.pool) return false;

    this.VERBOSE && console.debug('database ::: ', database);
    this.pool = mysql.createPool({
      host: hostname,
      user: username,
      database: database,
      password: password,
      port: Number(port),
      waitForConnections: true,
      connectionLimit: 200,
      queueLimit: 0,
      debug: test,
      multipleStatements: true,
    });

    return true;
  };

  public query = async (query: string, set?: Array<unknown>): Promise<any> => {
    this.VERBOSE && console.log('query :: ', query);
    if (!this.pool) return;
    const [results] = await this.pool.query({
      sql: query,
      values: set,
    });
    return results;
  };

  public delete = async (): Promise<boolean> => {
    if (!this.pool) return false;
    await this.pool.end();
    return true;
  };

  public getDatabase = () => {
    return this.connectionParameters.database;
  };

  public setDatabase = (database: string) => {
    this.connectionParameters.database = database;
  };
}

const SQLManager: MySqlPoolDatabaseApi = ((): MySqlPoolDatabaseApi => {
  const SQLManager = new MySqlPoolDatabaseApi();
  SQLManager.create();
  return SQLManager;
})();

export default SQLManager;
