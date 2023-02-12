export interface CustomErrorSetup {
  statusCode: number;
  message: string;
}
export interface CustomError extends Error {
  statusCode?: number;
  message: string;
}