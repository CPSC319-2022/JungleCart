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

function asyncWrap(handler) {
  return async (event) => {
    try {
      const result = await handler(event);
      return {
        statusCode: result.statusCode,
        body: JSON.stringify(result.body),
      };
    } catch (err) {
      const error = err as CustomError;
      return {
        statusCode: error.statusCode || 500,
        body: JSON.stringify({
          message: error.message || 'Internal Server Error??',
        }),
      };
    }
  };
}
export default asyncWrap;
