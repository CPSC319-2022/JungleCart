// A router to manage routes in the style of express
import { errorGenerator } from "/opt/common/customError-layer";

// Promise<{ statusCode: number; body: string } |
export type handler = (event?) => Promise<any>;
type Dict<T> = { [key: string]: T };

export class Router {
  private route_table: Dict<Dict<handler>> = {};

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
    console.log(this.route_table);
    if (!event.requestContext) {
      return { statusCode: 407, body: "ROUTE - expected requestContext" };
    }

    const path = event.requestContext.resourcePath;
    const method = event.requestContext.httpMethod;

    if (!this.route_table[path] || !this.route_table[path][method]) {
      return {
        statusCode: 405,
        body: "ROUTE - Invalid route: " + path + method
      };
    }

    // calls the function assigned based on the path and method
    return this.route_table[event.requestContext.resourcePath][event.requestContext.httpMethod](event);
  }

  public async routeThrowError(
    event
  ): Promise<{ statusCode: number; body: string }> {
    console.log(this.route_table);
    let msg = "";
    if (!event.requestContext) {
      msg = "ROUTE - expected requestContext";
      errorGenerator({ statusCode: 406, message: msg });
    }

    const path = event.requestContext.resourcePath;
    const method = event.requestContext.httpMethod;

    if (!this.route_table[path] || !this.route_table[path][method]) {
      msg = "ROUTE - Invalid route: " + path + method;
    }
    if (msg != "") errorGenerator({ statusCode: 405, message: msg });

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

export type response = Promise<any>;
