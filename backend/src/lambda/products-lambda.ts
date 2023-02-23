// eslint-disable-next-line @typescript-eslint/no-var-requires
const {query, Router, createConnection} = require("/opt/nodejs/node_modules/sql-layer");

// set routing
const router = new Router();

router.post('/', addProduct);
router.delete('/:productId', deleteProductById);
router.get('/:productId', getProductInfoById);
router.put('/:productId', updateProductInfoById);
router.get('/', getProductsInfo);

// create connection
createConnection(process.env as { [key: string]: string });

// handles routing and sends request
exports.handler = async function (event) {
    return await router.route(event);
};

// handlers
async function addProduct(event): Promise<response> {
    if (!validateProductInformation(event.body)) {
        return {
            statusCode: 422,
            body: "addProduct - Invalid product information"
        };
    }

    const prod = event.body;
    const sql = 'INSERT INTO test.product SET ?';

    return query(sql, [prod])
        .then((results) => ({
            statusCode: 201,
            body: results
        }))
        .catch((error) => ({
            statusCode: error.statusCode,
            body: error.message,
        }));
}

async function deleteProductById(event): Promise<response> {
    if (!event.body.id)
        return {statusCode: 400, body: 'deleteProductById - No id'};

    const id = event.body.id;
    const sql = 'DELETE FROM test.product WHERE id = ?';

    return query(sql, [id])
        .then((results) => ({
            statusCode: 204,
            body: results
        }))
        // todo check type of error if it is from invalid id (404) or connection error (599)
        .catch((error) => ({
            statusCode: error.statusCode,
            body: error.message,
        }));
}

async function getProductInfoById(event): Promise<response> {
    if (!event.body.id)
        return {statusCode: 400, body: 'getProductInfoById - No id'};

    const id = event.body.id;
    const sql = 'SELECT * FROM test.product WHERE id = ?';

    return query(sql, [id])
        .then((results) => ({
            statusCode: 200,
            body: results
        }))
        // todo check type of error if it is from invalid id (404) or connection error (599)
        .catch((error) => ({
            statusCode: error.statusCode,
            body: error.message,
        }));
}

async function updateProductInfoById(event): Promise<response> {
    if (!event.body.id || !event.body.info)
        return {statusCode: 400, body: 'updateProductInfoById - No id or info'};
    if (!validateProductInformation(event.body.info))
        return {statusCode: 422, body: "updateProductInfoById - Invalid product information"};

    const info = event.body.info;
    const id = event.body.id;
    const sql = 'UPDATE test.product SET ? WHERE id = ?';

    return query(sql, [info, id])
        .then((results) => ({
            statusCode: 200,
            body: results
        }))
        // todo check type of error if it is from invalid id (404) or connection error (599)
        .catch((error) => ({
            statusCode: error.statusCode,
            body: error.message,
        }));
}

async function getProductsInfo(event): Promise<response> {
    const searchOpt = event.body.searchOpt;
    const order = event.body.order;
    const pageOpt = event.body.pageOpt;
    return {statusCode: 300, body: ''};
}

// todo implement
function validateProductInformation(prod) {
    return prod === prod;
}

type response = {statusCode: number, body: object | string};
