import * as mysql from 'mysql'
import * as console from 'console'
import { Query } from 'mysql'

let connection: null | mysql.Connection

type handler = (event?) => Promise<{ statusCode: number; body: string }>
type Dict<T> = { [key: string]: T }

export class Router {
  private route_table: Dict<Dict<handler>> = {}

  constructor(env) {
    connection = createConnection(env as { [key: string]: string })
  }

  private addRoute(resourcePath: string, httpMethod: string, func: handler) {
    if (!this.route_table[resourcePath]) {
      this.route_table[resourcePath] = {}
    }

    this.route_table[resourcePath][httpMethod] = func
  }

  public delete(resourcePath: string, func: handler) {
    this.addRoute(resourcePath, 'DELETE', func)
  }

  public get(resourcePath: string, func: handler) {
    this.addRoute(resourcePath, 'GET', func)
  }

  public post(resourcePath: string, func: handler) {
    this.addRoute(resourcePath, 'POST', func)
  }

  public put(resourcePath: string, func: handler) {
    this.addRoute(resourcePath, 'PUT', func)
  }

  public async route(event): Promise<{ statusCode: number; body: string }> {
    return this.route_table[event.requestContext.resourcePath]
      [event.requestContext.httpMethod](event)
      .catch((err) => {
        return { statusCode: 400, body: err.message }
      })
  }
}

function createConnection(env: Dict<string>): mysql.Connection {
  return mysql.createConnection({
    host: env.RDS_HOSTNAME,
    user: env.RDS_USERNAME,
    password: env.RDS_PASSWORD,
    port: Number(env.RDS_PORT),
    multipleStatements: true,
    connectTimeout: 60 * 60 * 1000,
    timeout: 60 * 60 * 1000,
    debug: true,
  })
}

export async function query(query: string, set?): Promise<Query> {
  console.log('sql-layer: query')

  return new Promise((resolve, reject) => {
    if (!connection) return reject('Connection Null')

    if (connection.state !== 'connected') {
      connection.connect()
    }

    connection.query(query, set, (error, results) => {
      error ? reject(new Error(error.code)) : resolve(results)
    })
  })
}
