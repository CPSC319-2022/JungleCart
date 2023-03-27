import { Router, ResponseContent } from "/opt/core/router";
import ProductController from "./controller";

const router: Router = new Router();
const controller: ProductController = new ProductController();

// set routing
router.post('/products', controller.addProduct);
router.delete('/products/{productId}', controller.deleteProductById);
router.get('/products/{productId}', controller.getProductById);
router.put('/products/{productId}', controller.updateProductById);
router.get('/products', controller.getProducts);

// handles routing and sends request
exports.handler = async (event): Promise<ResponseContent> => {
    return await router.route(event);
};
