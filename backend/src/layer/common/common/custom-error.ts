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
}

export const errorGenerator = (obj: ICustomErrorSetup) => {
  const error: ICustomError = new Error(obj.message);
  error.statusCode = obj.statusCode;
  throw error;
};
