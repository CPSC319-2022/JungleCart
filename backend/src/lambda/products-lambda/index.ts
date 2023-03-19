import {SQLConnectionManager} from '/opt/common/sql-layer';
import { response, Router } from "/opt/common/router";

// set routing
const router = new Router();

router.post('/', addProduct);
router.delete('/:productId', deleteProductById);
router.get('/:productId', getProductInfoById);
router.put('/:productId', updateProductInfoById);
router.get('/', getProductsInfo);

// handles routing and sends request
exports.handler = async function (event) {
    return await router.route(event);
};

// handlers
export async function addProduct(event): Promise<response> {
    if (!validateProductInformation(event.body)) {
        return {
            statusCode: 422,
            body: 'addProduct - Invalid product information',
          headers: {
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
          },
        };
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

async function deleteProductById(event): Promise<response> {
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
    const sql = 'UPDATE dev.product SET ? WHERE id = ?';

    return (
        SQLConnectionManager.query(sql, [info, id])
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
  return {
    statusCode: 200,
    body: JSON.stringify({m: "ss"}),
    headers: {
      "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
    },
  };

    const searchOpt = event.body.searchOpt;
    const order = event.body.order;
    const pageOpt = event.body.pageOpt;

    // const sql = 'SELECT dev.product';
    // const retval = SQLConnectionManager.query(sql);
    //
    // return retval
    //     .then((results) => {
    //         return {
    //             statusCode: 200,
    //             body: results,
    //           headers: {
    //             "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
    //             "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
    //           },
    //         };
    //     }).catch((error) => {
    //         return {
    //             statusCode: 300,
    //             body: error.message,
    //         };
    //     });
}

// todo implement
function validateProductInformation(prod) {
    return prod === prod;
}
