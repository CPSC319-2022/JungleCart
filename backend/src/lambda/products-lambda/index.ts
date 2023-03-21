import {NetworkError, SQLConnectionManager} from '/opt/common/sql-layer';
import {createResponse, response, Router} from "/opt/common/router";

SQLConnectionManager.createConnection();

// set routing
const router = new Router();

router.post('/products', addProduct);
router.delete('/products/{productId}', deleteProductById);
router.get('/products/{productId}', getProductInfoById);
router.put('/products/{productId}', updateProductInfoById);
router.get('/products', getProductsInfo);

// handles routing and sends request
exports.handler = async function (event) {
    return await router.route(event);
};

// handlers
export async function addProduct(event): Promise<response> {
    if (!validateProductInformation(event.body)) {
        return createResponse(
            422,
            'addProduct - Invalid product information'
        );
    }

    const prod = event.body;
    const sql = 'INSERT INTO dev.product SET ?';

    return SQLConnectionManager.query(sql, [prod])
        .then((results) => ({
            statusCode: 201,
            body: results,
        }))
        .catch((error) => ({
            statusCode: error.statusCode,
            body: error.message,
        }));
}

async function deleteProductById(event): Promise<Response> {
    if (!event.body.id)
        return {statusCode: 400, body: 'deleteProductById - No id'};

    const id = event.body.id;
    const sql = 'DELETE FROM dev.product WHERE id = ?';

    return (
        SQLConnectionManager.query(sql, [id])
            .then((results) => ({
                statusCode: 204,
                body: results,
            }))
            // todo check type of error if it is from invalid id (404) or connection error (599)
            .catch((error) => ({
                statusCode: error.statusCode,
                body: error.message,
            }))
    );
}

async function getProductInfoById(event): Promise<response> {
    if (!event.body.id)
        return {statusCode: 400, body: 'getProductInfoById - No id'};

    const id = event.body.id;
    const sql = 'SELECT * FROM dev.product WHERE id = ?';

    return (
        SQLConnectionManager.query(sql, [id])
            .then((results) => ({
                statusCode: 200,
                body: results,
            }))
            // todo check type of error if it is from invalid id (404) or connection error (599)
            .catch((error) => ({
                statusCode: error.statusCode,
                body: error.message,
            }))
    );
}

async function updateProductInfoById(event): Promise<response> {
    if (!event.body.id || !event.body.info)
        return {statusCode: 400, body: 'updateProductInfoById - No id or info'};
    if (!validateProductInformation(event.body.info))
        return {
            statusCode: 422,
            body: 'updateProductInfoById - Invalid product information',
        };

    const info = event.body.info;
    const id = event.body.id;
    const sql = `UPDATE dev.product SET ${info} WHERE id = ${id}`;

    return (
        SQLConnectionManager.query(sql)
            .then((results) => ({
                statusCode: 200,
                body: results,
            }))
            // todo check type of error if it is from invalid id (404) or connection error (599)
            .catch((error) => ({
                statusCode: error.statusCode,
                body: error.message,
            }))
    );
}

async function getProductsInfo(event): Promise<response> {
    // const searchOpt = event.body.searchOpt;
    // const order = event.body.order;
    // const pageOpt = event.body.pageOpt;

    const sql = 'SELECT * FROM dev.product';

    try {
        const body = await SQLConnectionManager.query(sql);
        return createResponse(
            200,
            await SQLConnectionManager.query(sql),
        );
    } catch (e) {
        if (e instanceof NetworkError) {
            return {
                statusCode: e.statusCode,
                body: `getProductsInfo - ${e.message}`,
            };
        } else {
            return {
                statusCode: 469,
                body: `getProductsInfo - ${(e as Error).message}`,
            };
        }
    }
}

// todo implement
function validateProductInformation(prod) {
    return prod === prod;
}
