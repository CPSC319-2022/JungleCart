import { CustomError } from '/opt/common/custom-error';

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

// module.exports = { asyncWrap }
