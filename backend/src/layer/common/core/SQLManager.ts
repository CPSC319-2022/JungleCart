import * as mysql from '/opt/nodejs/node_modules/mysql2/promise';
import { ConnectionParameters, MySqlDatabaseApi } from '/opt/types/database';

const defaultConfig: ConnectionParameters = {
  hostname: '',
  username: '',
  password: '',
  port: 3306,
  database: 'dev',
};

const testConfig: ConnectionParameters = {
  ...defaultConfig,
  hostname: 'm',
};

export class MySqlPoolDatabaseApi extends MySqlDatabaseApi {
  private connectionParameters: ConnectionParameters;

  public create = (
    connectionParameters?: ConnectionParameters,
    test = false
  ): boolean => {
    console.debug('test ::: ', test);

    connectionParameters ??= defaultConfig;

    this.connectionParameters = test ? testConfig : connectionParameters;

    const { hostname, username, database, password, port } =
      this.connectionParameters;

    if (this.pool) return false;

    console.debug('database ::: ', database);
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
    console.log('query :: ', query);
    if (!this.pool) return;
    const [results] = await this.pool.query({
      sql: query,
      values: set,
    });
    console.log('rst in query', results);
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
