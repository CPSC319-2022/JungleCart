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
  return async (Request, Response) => {
    try {
      console.log('async >>> ');
      const result = await handler(event);
      console.log('async result ::: ', result);
      // return {
      //   statusCode: result.statusCode || 200,
      //   body: JSON.stringify(result.body),
      // };
      const statusCode = result.statusCode || 200;
      return Response.status(statusCode).send(JSON.stringify(result));
    } catch (err) {
      const error = err as CustomError;
      // return {
      //   statusCode: error.statusCode || 500,
      //   body: JSON.stringify({
      //     message: error.message || 'Internal Server Error',
      //   }),
      // };
      return;
    }
  };
}

// module.exports = { asyncWrap }
