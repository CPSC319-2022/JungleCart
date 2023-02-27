import {
  query,
  Router,
  createConnection,
} from '/opt/nodejs/node_modules/sql-layer';

const router = new Router();
import { Cart_item } from '../utils/types';

router.get('/', getCartItems);
router.post('/', addCartItem);
router.put('/', updateCartItems);
router.delete('/:id', deleteCartItem);

createConnection(
  process.env.RDS_HOSTNAME,
  process.env.RDS_USERNAME,
  process.env.RDS_PASSWORD,
  process.env.RDS_PORT
);

exports.handler = async (e) => {
  return await router.route(e);
};

async function getCartItems(e): Promise<response> {
  const bid = e.userId.slice(1);
  const sql =
    'SELECT JSON_ARRAYAGG(JSON_OBJECT("id", P.id, "product_uri", pm.url, "name", p.name, "quantity", c.quantity, "price", p.price)) as cart FROM cart_item c ' +
    'INNER JOIN product P ON c.product_id = p.id ' +
    'INNER JOIN product_multimedia PM ON p.id = pm.product_id ' +
    'WHERE c.buyer_id = ?';
  const rst = await queryProcessor(e.requestContext.httpMethod, e, sql, [bid]);
  if (rst.statusCode === 200) {
    rst.body = JSON.parse((rst.body as object)[0].cart);
    // const temp = JSON.parse((rst.body as object)[0].cart);
    // rst.body = temp;
  }
  return rst;
}

async function addCartItem(e): Promise<response> {
  const bid = e.userId.slice(1);
  const info: Cart_item = {
    buyer_id: bid as number,
    product_id: e.body.id,
    quantity: e.body.quantity,
  };
  const sql = 'INSERT INTO cart_item SET ?';
  return await queryProcessor(e.requestContext.httpMethod, e, sql, [info]);
}

async function updateCartItems(e): Promise<response> {
  const bid = e.userId.slice(1);
  const body = e.body.cart_items;
  const info = body
    .map((elem) => `(${bid}, ${elem.id}, ${elem.quantity})`)
    .join(', ');
  const sql = `INSERT INTO cart_item (buyer_id, product_id, quantity) VALUES ${info} ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`;
  return await queryProcessor(e.requestContext.httpMethod, e, sql);
}

async function deleteCartItem(e): Promise<response> {
  const bid = e.userId.slice(1);
  const id = e.id.slice(1);
  const sql = 'DELETE FROM cart_item WHERE buyer_id = ? AND product_id = ?';
  return await queryProcessor(e.requestContext.httpMethod, e, sql);
}

const queryProcessor = async function (
  m,
  e,
  sql: string,
  param?
): Promise<response> {
  if (m == 'POST' || m == 'PUT') {
    if (!e.userId || !e.body) return { statusCode: 400, body: 'no user id' };
  } else {
    if (!e.userId) return { statusCode: 400, body: 'no user id' };
  }
  return query(sql, param)
    .then((results) => ({
      statusCode: 200,
      body: results,
    }))
    .catch((error) => ({
      statusCode: 400,
      body: error.message,
    }));
};

type response = { statusCode: number; body: object | string };
