import { query, Router } from '/opt/nodejs/node_modules/sql-layer'
const router = new Router(process.env as { [key: string]: string })

router.get('/', getCartItems)
// router.post('/', addCartItem)
// router.put('/', updateCartItems)
// router.delete('/:id', deleteCartItem)

exports.handler = async (e) => {
  return await router.route(e)
}

async function getCartItems(e) {
  if (!e.userId) return { statusCode: 400, body: 'no user id' }
  const bid = e.userId.slice(1)
  const sql =
    'SELECT JSON_ARRAYAGG(JSON_OBJECT("id", P.id, "product_uri", pm.url, "name", p.name, "quantity", c.quantity, "price", p.price)) FROM cart_item c ' +
    'INNER JOIN product P ON c.product_id = p.id ' +
    'INNER JOIN product_multimedia PM ON p.id = pm.product_id ' +
    'WHERE c.buyer_id = ?'
  return queryProcessor(sql, [bid])
}

// async function addCartItem(e) {
//   if (!e.body.userId || e.body.info) return { statusCode: 400, body: 'no user id' }

// }
// async function updateCartItems(e) {}
// async function deleteCartItem(e) {}

const queryProcessor = async function (sql: string, param?: string[]) {
  return query(sql, param)
    .then((results) => ({
      statusCode: 200,
      body: results,
    }))
    .catch((error) => ({
      statusCode: 400,
      body: error.message,
    }))
}
