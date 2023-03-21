// A router to manage routes in the style of express
import {CustomError} from "./customError-layer";

export type handler = (event?) => Promise<Response>;
type Dict<T> = { [key: string]: T };

export class Router {
    private routeTable: Dict<Dict<handler>> = {};

    public delete(resourcePath: string, func: handler) {
        this.addRoute(resourcePath, "DELETE", func);
    }

    public get(resourcePath: string, func: handler) {
        this.addRoute(resourcePath, "GET", func);
    }

    public post(resourcePath: string, func: handler) {
        this.addRoute(resourcePath, "POST", func);
    }

    public put(resourcePath: string, func: handler) {
        this.addRoute(resourcePath, "PUT", func);
    }

    public async route(event): Promise<Response> {
        console.log(this.routeTable);
        if (!event.requestContext) {
            return createResponse(
                407,
                'ROUTE - expected requestContext'
            );
        }

        const path = event.requestContext.resourcePath;
        const method = event.requestContext.httpMethod;

        if (!this.routeTable[path] || !this.routeTable[path][method]) {
            return createResponse(
                405,
                'ROUTE - Invalid route: ' + path + method
            );
        }

        try {
            // calls the function assigned based on the path and method
            return await this.routeTable[path][method](event);
        } catch (error) {
            const customError = error as CustomError;
            return createResponse(
                customError.statusCode || 500,
                customError.message || 'ROUTE - Internal Server Error'
            );
        }
    }

    private addRoute(resourcePath: string, httpMethod: string, func: handler) {
        if (!this.routeTable[resourcePath]) {
            this.routeTable[resourcePath] = {};
        }

        this.routeTable[resourcePath][httpMethod] = func;
    }
}

export type Response = {
    statusCode: number;
    body: string;
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    }
}

export const createResponse = (statusCode: number, body: string): Response => ({
    statusCode: statusCode,
    body: body
} as Response);
