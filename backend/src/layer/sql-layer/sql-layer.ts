import * as mysql from 'mysql';
import { MysqlError, Query } from 'mysql';
import * as console from 'console';

let connection: null | mysql.Connection;

type handler = (event?) => Promise<{ statusCode: number; body: string }>;
type Dict<T> = { [key: string]: T };

// A router to manage routes in the style of express
export class Router {
  private route_table: Dict<Dict<handler>> = {};

  public delete(resourcePath: string, func: handler) {
    this.addRoute(resourcePath, 'DELETE', func);
  }

  public get(resourcePath: string, func: handler) {
    this.addRoute(resourcePath, 'GET', func);
  }

  public post(resourcePath: string, func: handler) {
    this.addRoute(resourcePath, 'POST', func);
  }

  public put(resourcePath: string, func: handler) {
    this.addRoute(resourcePath, 'PUT', func);
  }

  public async route(event): Promise<{ statusCode: number; body: string }> {
    console.log(this.route_table);
    if (!event.requestContext) {
      return { statusCode: 407, body: 'ROUTE - expected requestContext' };
    }

    const path = event.requestContext.resourcePath;
    const method = event.requestContext.httpMethod;

    if (!this.route_table[path] || !this.route_table[path][method]) {
      return {
        statusCode: 405,
        body: 'ROUTE - Invalid route: ' + path + method,
      };
    }

    // calls the function assigned based on the path and method
    return this.route_table[event.requestContext.resourcePath][
      event.requestContext.httpMethod
    ](event);
  }

  private addRoute(resourcePath: string, httpMethod: string, func: handler) {
    if (!this.route_table[resourcePath]) {
      this.route_table[resourcePath] = {};
    }

    this.route_table[resourcePath][httpMethod] = func;
  }
}

// export function createConnection(
//   hostname: string,
//   user: string,
//   password: string,
//   port: string
// ) {
//   connection = mysql.createConnection({
//     host: hostname,
//     user: user,
//     password: password,
//     port: Number(port),
//     multipleStatements: true,
//     connectTimeout: 60 * 60 * 1000,
//     timeout: 60 * 60 * 1000,
//     debug: true,
//   });

// }

export function createConnection(
  name: string,
  hostname: string,
  user: string,
  password: string,
  port: string
) {
  const pool = mysql.createPool({
    database: name,
    host: hostname,
    user: user,
    password: password,
    port: Number(port),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    debug: true,
  });

  return pool;
}

export async function query(query: string, set?): Promise<Query> {
  console.log('sql-layer: query');

  return new Promise((resolve, reject) => {
    if (!connection)
      return reject(new FailedDependencyError('Connection Null'));

    if (connection.state !== 'connected') {
      connection.connect((error: MysqlError) => {
        if (error) {
          // 599
          reject(new NetworkConnectTimeoutError(error.code));
        }
      });
    }

    connection.query(query, set, (error, results) => {
      // todo find types of query errors to return correct status code
      error ? reject(new BadRequest(error.code)) : resolve(results);
    });
  });
}

class NetworkError extends Error {
  statusCode: number;

  constructor(msg: string) {
    super(msg);
  }
}

class NotFoundError extends NetworkError {
  statusCode = 404;
}

class BadRequest extends NetworkError {
  statusCode = 400;
}

class NetworkConnectTimeoutError extends NetworkError {
  statusCode = 599;
}

class FailedDependencyError extends NetworkError {
  statusCode = 424;
}
