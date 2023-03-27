// A router to manage routes in the style of express
import NetworkError from './network-error';

export type Handler = (request: Request, response: Response) => Promise<Result>;
type Dict<T> = { [key: string]: T };

export class Router {
  private routeTable: Dict<Dict<Handler>> = {};

  public delete = (resourcePath: string, func: Handler): void => {
    this.addRoute(resourcePath, 'DELETE', func);
  };

  public get = (resourcePath: string, func: Handler): void => {
    this.addRoute(resourcePath, 'GET', func);
  };

  public post = (resourcePath: string, func: Handler): void => {
    this.addRoute(resourcePath, 'POST', func);
  };

  public put = (resourcePath: string, func: Handler): void => {
    this.addRoute(resourcePath, 'PUT', func);
  };

  public update = (resourcePath: string, func: Handler): void => {
    this.addRoute(resourcePath, 'UPDATE', func);
  };

  public route = async (event): Promise<ResponseContent> => {
    console.log(this.routeTable);

    const request: Request = { body: event.body, params: event.pathParameters };
    return await new Promise((resolve, reject) => {
      const response: Response = new Response(resolve, reject);

      this.getFunction(event)(request, response).catch((error) =>
        response
          .status(
            error instanceof NetworkError
              ? error.statusCode
              : NetworkError.INTERNAL_SERVER.statusCode
          )
          .send(error.message)
      );
    });
  };

  private getFunction = (event): Handler => {
    if (!event.requestContext) throw NetworkError.BAD_REQUEST;

    const path = event.requestContext.resourcePath;
    const method = event.requestContext.httpMethod;

    if (!this.routeTable[path]) throw NetworkError.NOT_FOUND;
    if (!this.routeTable[path][method]) throw NetworkError.METHOD_NOT_ALLOWED;

    return this.routeTable[path][method];
  };

  private addRoute = (
    resourcePath: string,
    httpMethod: string,
    func: Handler
  ): void => {
    if (!this.routeTable[resourcePath]) {
      this.routeTable[resourcePath] = {};
    }

    this.routeTable[resourcePath][httpMethod] = func;
  };
}

export interface Request {
  body;
  params?;
}

export class ResponseContent {
  statusCode: number;
  body: string;
  headers: object;

  constructor() {
    this.headers = {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': '*',
    };
  }
}

class Value {
  private readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  public get = (): string => {
    return this.value;
  };
}

export type Result = Value & { __nominal: never };

type ResponseCallback = (content: ResponseContent) => void;

export class Response {
  private content: ResponseContent = new ResponseContent();
  private readonly resolve: ResponseCallback;
  private readonly reject: ResponseCallback;

  constructor(resolve: ResponseCallback, reject: ResponseCallback) {
    this.resolve = resolve;
    this.reject = reject;
  }

  public status = (statusCode: number): Response => {
    this.content.statusCode = statusCode;
    return this;
  };

  public send = (body): Result => {
    this.content.body = typeof body === 'string' ? body : JSON.stringify(body);
    this.resolve(this.content);

    return new Value(body) as Result;
  };

  public throw = (error: Error): Result => {
    this.content.statusCode ??=
      error instanceof NetworkError
        ? error.statusCode
        : NetworkError.INTERNAL_SERVER.statusCode;
    this.content.body = error.message;
    this.reject(this.content);

    throw error;
  };
}
