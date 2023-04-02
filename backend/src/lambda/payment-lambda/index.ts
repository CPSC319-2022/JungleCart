import { checkCardValidation } from './controller';
import NetworkError from '/opt/core/network-error';
import { Router } from '/opt/core/router';
const router: Router = new Router();
exports.handler = async (e) => {
  return await router.route(e);
};

exports.handler = async (e) => {
  return await router.route(e);
};

router.put('/orders/{id}/{paymentId}', handling(checkCardValidation));

function handling(controller) {
  return async (Request, Response) => {
    try {
      return await controller(Request, Response);
    } catch (err) {
      const error = err as NetworkError;
      return Response.status(400).send(error.message);
    }
  };
}
