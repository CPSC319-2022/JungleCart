// noinspection SqlNoDataSourceInspection
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {query, Router} = require("/opt/nodejs/node_modules/sql-layer");

const router = new Router(process.env as { [key: string]: string });

router.post('/', addProduct);
router.delete('/:productId', deleteProductById);
router.get('/:productId', getProductInfoById);
router.put('/:productId', updateProductInfoById);
router.get('/', getProductsInfo);

exports.handler = async function (event) {
    return await router.route(event);
};

async function addProduct(event) {
    const prod = event.body;
    const sql = 'INSERT INTO backend.product SET ?';

    return query(sql, [prod])
        .then((results) => ({
            statusCode: 200,
            body: results
        }))
        .catch((error) => ({
            statusCode: 400,
            body: error.message
        }));
}

async function deleteProductById(event) {
    if (!event.body.id) return {statusCode: 400, body: 'no id'};

    const id = event.body.id;
    const sql = 'DELETE FROM product WHERE id = ?';

    return query(sql, [id])
        .then((results) => ({
            statusCode: 200,
            body: results
        }))
        .catch((error) => ({
            statusCode: 400,
            body: error.message
        }));
}

async function getProductInfoById(event) {
    if (!event.body.id) return {statusCode: 400, body: 'no id'};

    const id = event.body.id;
    const sql = 'SELECT * FROM backend.product WHERE id = ?';

    return query(sql, [id])
        .then((results) => ({
            statusCode: 200,
            body: results
        }))
        .catch((error) => ({
            statusCode: 400,
            body: error.message
        }));
}

async function updateProductInfoById(event) {
    if (!event.body.id || !event.body.info) return {statusCode: 400, body: 'no id or info'};

    const info = event.body.info;
    const id = event.body.id;
    const sql = 'UPDATE product SET ? WHERE id = ?';

    return query(sql, [info, id])
        .then((results) => ({
            statusCode: 200,
            body: results
        }))
        .catch((error) => ({
            statusCode: 400,
            body: error.message
        }));
}

async function getProductsInfo(event) {
    const searchOpt = event.body.searchOpt;
    const order = event.body.order;
    const pageOpt = event.body.pageOpt;
    return {statusCode: 300, body: ''};
}
