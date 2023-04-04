import * as mysql from '/opt/nodejs/node_modules/mysql2/promise';

const defaultRDSConfig = {
  hostname: 'sqldb.cyg4txabxn5r.us-west-2.rds.amazonaws.com',
  user: 'admin',
  password: 'PeterSmith319',
  port: 3306,
  database: 'dev',
};

const testRDSConfig = {
  ...defaultRDSConfig,
  database: 'test',
};

export interface ConnectionParameters {
  hostname: string;
  user: string;
  password: string;
  port: number;
  database: string;
}

export class SQLManagerClass {
  private pool: mysql.Pool;
  private defaultConnectionParameters: ConnectionParameters = defaultRDSConfig;
  private testConnectionParameters: ConnectionParameters = testRDSConfig;

  public createConnectionPool = (
    connectionParameters?: ConnectionParameters,
    test = false
  ): boolean => {
    console.debug('test ::: ', test);
    const { hostname, user, database, password, port } = test
      ? this.testConnectionParameters
      : connectionParameters ?? this.defaultConnectionParameters;

    if (this.pool) return false;

    console.debug('database ::: ', database);
    this.pool = mysql.createPool({
      host: hostname,
      user: user,
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
    console.log('rst in query', results);
    return results;
  };

  public async endPool() {
    await this.pool.end();
  }
}

const SQLManager: SQLManagerClass = ((): SQLManagerClass => {
  const SQLManager = new SQLManagerClass();
  SQLManager.createConnectionPool();
  return SQLManager;
})();

export default SQLManager;
