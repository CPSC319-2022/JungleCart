// A router to manage routes in the style of express
import NetworkError from "/opt/common/network-error";

export type handler = (request: Request, response: Response) => Promise<Result>;
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

    public update(resourcePath: string, func: handler) {
        this.addRoute(resourcePath, "UPDATE", func);
    }

    public async route(event): Promise<ResponseContent> {
        console.log(this.routeTable);

        const request: Request = {body: event.body, params: event.pathParameters};
        return await new Promise((resolve, reject) => {
            const response: Response = new Response(resolve, reject);

            // calls the function assigned based on the path and method
            this.getFunction(event)(request, response).catch((error) =>
                response.status(
                    (error instanceof NetworkError) ?
                        error.statusCode :
                        NetworkError.INTERNAL_SERVER.statusCode
                ).send(error.message)
            );
        });
    }

    private getFunction(event): handler {
        if (!event.requestContext) throw NetworkError.BAD_REQUEST;

        const path = event.requestContext.resourcePath;
        const method = event.requestContext.httpMethod;

        if (!this.routeTable[path]) throw NetworkError.NOT_FOUND;
        if (!this.routeTable[path][method]) throw NetworkError.METHOD_NOT_ALLOWED;

        return this.routeTable[path][method];
    }

    private addRoute(resourcePath: string, httpMethod: string, func: handler) {
        if (!this.routeTable[resourcePath]) {
            this.routeTable[resourcePath] = {};
        }

        this.routeTable[resourcePath][httpMethod] = func;
    }
}

export interface Request {
    body;
    params?;
}

class ResponseContent {
    statusCode: number;
    body: string;
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    };
}

class Value {

    constructor(private value: string) {
    }

    public get() {
        return this.value;
    }
}

export type Result = Value & { __nominal: never; };

export class Response {

    private content: ResponseContent = new ResponseContent();
    private readonly resolve: (content: ResponseContent) => void;
    private readonly reject: (content: ResponseContent) => void;

    constructor(resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
    }

    public status(statusCode: number) {
        this.content.statusCode = statusCode;
        return this;
    }

    public send(body): Result {
        this.content.body = (typeof body === 'string') ? body : JSON.stringify(body);
        this.resolve(this.content);

        return new Value(body) as Result;
    }

    public throw(error: Error): Result {
        this.content.statusCode ??= (error instanceof NetworkError) ? error.statusCode : NetworkError.INTERNAL_SERVER.statusCode;
        this.content.body = error.message;
        this.reject(this.content);

        throw error;
    }
}
