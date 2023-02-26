import { UserController } from '../controllers';
import asyncWrap from './async-wrap';
const {
  Router,
  createConnection,
// eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('/opt/nodejs/node_modules/sql-layer');

const router = new Router();

router.get('/', asyncWrap(UserController.listUsers));
router.put('/:userId', asyncWrap(UserController.updateUserInfoById));
router.get('/:userId', asyncWrap(UserController.getUserInfoById));
router.post('/', asyncWrap(UserController.addUser));

router.get('/:userId/addresses', asyncWrap(UserController.getAddresses));
router.get(
  '/:userId/addresses/:addressId',
  asyncWrap(UserController.getAddressesByUserId)
);
router.post('/:userId/addresses', asyncWrap(UserController.addAddress));
router.delete(
  '/:userId/addresses/:addressId',
  asyncWrap(UserController.deleteAddressById)
);
router.put(
  '/:userId/addresses/:addressId',
  asyncWrap(UserController.updateAddressById)
);

router.get('/:userId/seller', asyncWrap(UserController.getSellerInfo));
router.get('/:userId/buyer', asyncWrap(UserController.getBuyerInfo));

createConnection(
  process.env.RDS_HOSTNAME,
  process.env.RDS_USERNAME,
  process.env.RDS_PASSWORD,
  process.env.RDS_PORT
);

// handles routing and sends request
exports.handler = asyncWrap(async function (event, context) {
  return await router.route(event);
});
