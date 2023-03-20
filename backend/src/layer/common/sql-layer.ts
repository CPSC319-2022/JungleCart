import * as mysql from "mysql";
import { MysqlError, Query } from "mysql";

export class SQLManager {
  private connection: null | mysql.Connection;
  private pool: null | mysql.Pool;
  constructor() {
    this.createConnectionPool(
      'sqldb.cyg4txabxn5r.us-west-2.rds.amazonaws.com',
      'admin',
      'PeterSmith319',
      '3306',
      'sqlDB'
    );
  }

  private connectToDB(
    hostname: string,
    user: string,
    password: string,
    port: string
  ): void {
    if (this.connection?.state === 'connected') {
      return;
    }
    this.connection = mysql.createConnection({
      host: hostname,
      user: user,
      password: password,
      port: Number(port),
      multipleStatements: true,
      connectTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
      debug: false,
    });
  }

  createConnectionPool(
    hostname: string,
    user: string,
    password: string,
    port: string,
    database: string
  ): void {
    this.pool = mysql.createPool({
      host: hostname,
      user: user,
      database: database,
      password: password,
      port: Number(port),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      debug: true,
    });
  }

  createConnection(
    useDefault = false,
    hostname?: string,
    user?: string,
    password?: string,
    port?: string
  ): void {
    try {
      if (useDefault) {
        this.connectToDB(
          'sqldb.cyg4txabxn5r.us-west-2.rds.amazonaws.com',
          'admin',
          'PeterSmith319',
          '3306'
        );
      } else {
        this.connectToDB(hostname!, user!, password!, port!);
      }
    } catch (e) {
      throw e as Error;
    }
  }

  query(query: string, set?): Promise<Query | any[]> {
    return new Promise((resolve, reject) => {
      if (!this.connection) {
        return reject(new FailedDependencyError('Connection Null'));
      }
      // if (this.connection.state !== 'connected') {
      //   this.connection.connect((error: MysqlError) => {
      //     if (error) {
      //       // 599
      //       reject(new NetworkConnectTimeoutError(error.code));
      //     }
      //   });
      // }

      this.connection.query(query, set, (error, results) => {
        // todo find types of query errors to return correct status code
        error ? reject(new BadRequest(error.code)) : resolve(results);
      });
    });
  }

  queryPool(query: string, set?): Promise<Query> {
    return new Promise((resolve, reject) => {
      if (!this.pool) {
        reject(new FailedDependencyError('Connection Null'));
        return;
      }
      console.log('in queryPool');

      this.pool.getConnection((error: MysqlError, conn) => {
        if (error) {
          // 599
          console.log('err1', error);
          reject(new NetworkConnectTimeoutError(error.code));
          return;
        }
        conn.query(query, set, (error, results) => {
          // todo find types of query errors to return correct status code
          console.log('<<query :::: ', query);

          if (error) {
            reject(new BadRequest('Bad Request'));
            return;
          }
          conn.release();
          resolve(results);
        });
      });
    });
  }

  closeConnection(): void {
    if (this.connection) {
      this.connection.end();
    }
  }
}


export class NetworkError extends Error {
  statusCode: number;

  constructor(msg: string) {
    super(msg);
  }
}

export class NotFoundError extends NetworkError {
  statusCode = 404;
}

export class BadRequest extends NetworkError {
  statusCode = 400;
}

class NetworkConnectTimeoutError extends NetworkError {
  statusCode = 599;
}

class FailedDependencyError extends NetworkError {
  statusCode = 424;
}

export const SQLConnectionManager = new SQLManager();