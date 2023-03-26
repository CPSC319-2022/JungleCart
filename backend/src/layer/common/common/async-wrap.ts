import { Request, Response, Result } from '/opt/common/router';
import { CustomError } from '/opt/common/custom-error';

export function asyncWrap(controller) {
  return async (req: Request, res: Response) => {
    try {
      console.log('async >>> ');
      const result = await controller(req, res);
      console.log('async result ::: ', result);
      console.log('async req ::: ', req);
      return result;
    } catch (err) {
      const error = err as CustomError;
      return res
        .status(error.statusCode || 500)
        .send(
          JSON.stringify({ message: error.message || 'Internal Server Error' })
        );
    }
  };
}

// module.exports = { asyncWrap }
