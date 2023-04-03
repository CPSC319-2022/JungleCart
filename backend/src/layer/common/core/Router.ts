// A router to manage routes in the style of express
import NetworkError from './NetworkError';

export type RouterType = "Lambda" | "Step";
export type Handler = (request: Request, response: Response) => Promise<Result>;
type Dict<T> = { [key: string]: T };

export default class Router {
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

  public patch = (resourcePath: string, func: Handler): void => {
    this.addRoute(resourcePath, 'PATCH', func);
  };

  public route = async (event, dest="Lambda"): Promise<ResponseContent> => {
    console.log(this.routeTable);

    const params = dest === "Lambda"? event.pathParameters: event.path;
    const request: Request = {
      headers: event.headers,
      body:
        typeof event.body === 'string' ? JSON.parse(event.body) : event.body,
      params: params? params: {},
      query: dest === "Lambda"?  event.queryStringParameters: event.querystring,
    };

    return await new Promise((resolve) => {
      const response: Response = new Response(resolve);

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
  headers?;
  body;
  params;
  query?;
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
  private readonly value;

  constructor(value) {
    this.value = value;
  }

  public get = () => {
    return this.value;
  };
}

export type Result = Value & { __nominal: never };

type ResponseCallback = (content: ResponseContent) => void;

export class Response {
  private content: ResponseContent = new ResponseContent();
  private readonly resolve: ResponseCallback;

  constructor(resolve: ResponseCallback) {
    this.resolve = resolve;
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
    this.status(
      error instanceof NetworkError
        ? error.statusCode
        : NetworkError.INTERNAL_SERVER.statusCode
    );
    this.send(error.message);

    throw error;
  };
}
