import { ResponseContent, Router } from '/opt/core/router';
import LoginController from './controller';
const router = new Router();

router.get('/login', LoginController.login);
router.post('/login', LoginController.signup);

exports.handler = async (event): Promise<ResponseContent> => {
  console.log('<TEST::: LOGIN STACK >');
  console.log('<event ::: ', event);
  console.log('<event body ::: ', event.body);
  const handlerResult = await router.route(event);
  console.log('handlerResult ::: ', handlerResult);
  return handlerResult;
};
