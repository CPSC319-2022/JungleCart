import * as console from 'console';
class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  getErrorMessage() {
    return 'Something went wrong: ' + this.message;
  }
}

export function asyncWrap(handler) {
  return async (event) => {
    try {
      console.log('async >>> ');
      const result = await handler(event);
      console.log('async result ::: ', result);
      return {
        statusCode: result.statusCode || 200,
        body: JSON.stringify(result.body),
      };
    } catch (err) {
      const error = err as CustomError;
      return {
        statusCode: error.statusCode || 500,
        body: JSON.stringify({
          message: error.message || 'Internal Server Error',
        }),
      };
    }
  };
}

// module.exports = { asyncWrap }
