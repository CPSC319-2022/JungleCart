import * as mysql from '/opt/nodejs/node_modules/mysql2/promise';
import { ConnectionParameters, DatabaseApi } from "/opt/types/database";

const defaultRDSConfig: ConnectionParameters = {
  hostname: 'sqldb.cyg4txabxn5r.us-west-2.rds.amazonaws.com',
  username: 'admin',
  password: 'PeterSmith319',
  port: 3306,
  database: 'dev',
};

const testRDSConfig: ConnectionParameters = {
  ...defaultRDSConfig,
  database: 'test',
};

export class sqlDatabase extends DatabaseApi {

  private connectionParameters: ConnectionParameters = defaultRDSConfig;

  public createConnectionPool = (
    connectionParameters?: ConnectionParameters,
    test = false
  ): boolean => {
    console.debug('test ::: ', test);
    const { hostname, username, database, password, port } = test
      ? testRDSConfig
      : connectionParameters ?? this.connectionParameters;

    if (this.pool) return false;

    console.debug('database ::: ', database);
    this.pool = mysql.createPool({
      host: hostname,
      user: username,
      database: database,
      password: password,
      port: Number(port),
      waitForConnections: true,
      connectionLimit: 60, // RDS max
      queueLimit: 0,
      debug: test,
      multipleStatements: true,
    });

    return true;
  };

  public query = async (query: string, set?: Array<unknown>): Promise<any> => {
    const [results] = await this.pool.query({
      sql: query,
      values: set,
    });
    return results;
  };

  public endPool = async () => {
    await this.pool.end();
  }

  public getDatabase = () => {
    return this.connectionParameters.database;
  }
}

const SQLManager: sqlDatabase = ((): sqlDatabase => {
  const SQLManager = new sqlDatabase();
  SQLManager.createConnectionPool();
  return SQLManager;
})();

export default SQLManager;
