import { CustomError } from '../utils/errors';

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
          message: error.message || 'Internal Server Error',
        }),
      };
    }
  };
}
export default asyncWrap;
