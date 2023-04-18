import serverless_mysql from '/opt/nodejs/node_modules/serverless-mysql';
import * as dotenv from '/opt/nodejs/node_modules/dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const mysql = serverless_mysql({
  config: {
    host: process.env.RDS_HOSTNAME,
    port: Number(process.env.RDS_PORT),
    database: process.env.RDS_DATABASE,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
  },
});

export class MySqlFacade {
  private readonly database: string | undefined;
  private VERBOSE = false;
  private mysql: serverless_mysql.ServerlessMysql = mysql;

  constructor(library?: serverless_mysql.ServerlessMysql) {
    if (library) {
      this.mysql = library;
    }

    this.database = this.mysql.getConfig().database;
  }

  public query = async (query: string, set?: Array<unknown>): Promise<any> => {
    this.VERBOSE && console.log('query :: ', query);

    const results = await this.mysql.query({
      sql: query,
      values: set,
    });

    return results;
  };

  public end = async (): Promise<boolean> => {
    await this.mysql.end();
    return true;
  };

  public getDatabase = () => {
    return this.database;
  };
}

const facade = new MySqlFacade();
export default facade;
