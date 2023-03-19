import * as mysql from 'mysql';
import {MysqlError, Query} from 'mysql';
import {errorGenerator} from '/opt/customError-layer';

export class SQLManager {
    private connection: null | mysql.Connection;
    private pool: null | mysql.Pool;

    constructor() {
        this.createConnectionPool(
            'sqldb.cyg4txabxn5r.us-west-2.rds.amazonaws.com',
            'admin',
            'PeterSmith319',
            '3306',
            'dev'
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

    query(query: string, set?): Promise<Query> {
        return new Promise((resolve, reject) => {
            if (!this.connection) {
                return reject(new FailedDependencyError('Connection Null'));
            }

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

// Promise<{ statusCode: number; body: string } |
export type handler = (event?) => Promise<any>;
export type response = Promise<any>;
type Dict<T> = { [key: string]: T };

// A router to manage routes in the style of express
export class Router {
    private routeTable: Dict<Dict<handler>> = {};
    private basePath: string | undefined;

    constructor(basePath?: string) {
        this.basePath = basePath;
    }

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
        console.log(this.routeTable);
        if (!event.requestContext) {
            return {statusCode: 407, body: 'ROUTE - expected requestContext'};
        }

        const path = event.requestContext.resourcePath;
        const method = event.requestContext.httpMethod;

        if (!this.routeTable[path] || !this.routeTable[path][method]) {
            return {
                statusCode: 405,
                body: 'ROUTE - Invalid route: ' + path + method,
            };
        }

        // calls the function assigned based on the path and method
        return {
            ...this.routeTable[path][method](event),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
        };
    }

    public async routeThrowError(
        event
    ): Promise<{ statusCode: number; body: string }> {
        console.log(this.routeTable);
        let msg = '';
        if (!event.requestContext) {
            msg = 'ROUTE - expected requestContext';
            errorGenerator({statusCode: 406, message: msg});
        }

        const path = event.requestContext.resourcePath;
        const method = event.requestContext.httpMethod;

        if (!this.routeTable[path] || !this.routeTable[path][method]) {
            msg = 'ROUTE - Invalid route: ' + path + method;
        }
        if (msg != '') errorGenerator({statusCode: 405, message: msg});

        // calls the function assigned based on the path and method
        return this.routeTable[event.requestContext.resourcePath][
            event.requestContext.httpMethod
            ](event);
    }

    private addRoute(resourcePath: string, httpMethod: string, func: handler) {
        const path = `${this.basePath || ''}${resourcePath}`;

        if (!this.routeTable[path]) {
            this.routeTable[path] = {};
        }

        this.routeTable[path][httpMethod] = func;
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
