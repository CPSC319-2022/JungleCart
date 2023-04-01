export default class NetworkError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.message += this.stack;
    this.statusCode = statusCode;
  }

  public msg = (message: string): NetworkError => {
    this.message = message;
    return this;
  };

  public static BAD_REQUEST = new NetworkError('Invalid request', 400);
  public static NOT_FOUND = new NetworkError('Resource not found', 404);
  public static UNAUTHORIZED = new NetworkError('Unauthorized request', 404);
  public static METHOD_NOT_ALLOWED = new NetworkError(
    'Method not allowed',
    405
  );
  public static UNPROCESSABLE_CONTENT = new NetworkError(
    'Unprocessable content',
    422
  );
  public static FAILED_DEPENDENCY = new NetworkError('Failed dependency', 424);
  public static INTERNAL_SERVER = new NetworkError(
    'Internal server error',
    500
  );
  public static NETWORK_CONNECT_TIMEOUT = new NetworkError(
    'Network connection timed out',
    599
  );
}
