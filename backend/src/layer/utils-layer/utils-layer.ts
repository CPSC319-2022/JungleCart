export function asyncWrap(controller) {
  return async (event) => {
    try {
      console.log('async >>> ');
      const result = await controller(event);
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

export interface ICustomErrorSetup {
  statusCode: number;
  message: string;
}
export interface ICustomError extends Error {
  statusCode?: number;
  message: string;
}
export class CustomError extends Error {
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

export const errorGenerator = (obj: ICustomErrorSetup) => {
  const error: ICustomError = new Error(obj.message);
  error.statusCode = obj.statusCode;
  throw error;
};
