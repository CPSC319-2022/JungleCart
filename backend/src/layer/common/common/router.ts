// A router to manage routes in the style of express
import { errorGenerator } from "./customError-layer";

// Promise<{ statusCode: number; body: string } |
export type handler = (event?) => Promise<any>;
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
      ... await this.routeTable[path][method](event),
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
    let msg = "";
    if (!event.requestContext) {
      msg = "ROUTE - expected requestContext";
      errorGenerator({ statusCode: 406, message: msg });
    }

    const path = event.requestContext.resourcePath;
    const method = event.requestContext.httpMethod;

    if (!this.routeTable[path] || !this.routeTable[path][method]) {
      msg = "ROUTE - Invalid route: " + path + method;
    }
    if (msg != "") errorGenerator({ statusCode: 405, message: msg });

    // calls the function assigned based on the path and method
    return this.routeTable[event.requestContext.resourcePath][
      event.requestContext.httpMethod
      ](event);
  }

  private addRoute(resourcePath: string, httpMethod: string, func: handler) {
    if (!this.routeTable[resourcePath]) {
      this.routeTable[resourcePath] = {};
    }

    this.routeTable[resourcePath][httpMethod] = func;
  }
}

export type response = Promise<any>;
