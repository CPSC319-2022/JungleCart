"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var services_1 = require("../services");
var errorGenerator_1 = __importDefault(require("../utils/errorGenerator"));
var ProductController = /** @class */ (function () {
    function ProductController() {
        console.log('product controller constructor');
    }
    ProductController.prototype.addProduct = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var productDTO, productId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        productDTO = req.body;
                        if (!this.isProductInputValid(productDTO)) {
                            (0, errorGenerator_1.default)({
                                message: 'INVALID_INPUT: product info is not valid',
                                statusCode: 422,
                            });
                        }
                        return [4 /*yield*/, services_1.ProductService.addProduct(productDTO)];
                    case 1:
                        productId = _a.sent();
                        res.status(201).json({ id: productId });
                        return [2 /*return*/];
                }
            });
        });
    };
    ProductController.prototype.deleteProductById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.status(201).json({ message: 'product deleted' });
                return [2 /*return*/];
            });
        });
    };
    ProductController.prototype.getProductInfoById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var productId, product;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        productId = Number(req.params.id);
                        return [4 /*yield*/, services_1.ProductService.getProductInfoById(productId)];
                    case 1:
                        product = _a.sent();
                        res.status(200).json({ product: product });
                        return [2 /*return*/];
                }
            });
        });
    };
    ProductController.prototype.updateProductInfoById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.status(201).json({ message: 'product updated' });
                return [2 /*return*/];
            });
        });
    };
    ProductController.prototype.getProductsInfo = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var searchParams, searchOpt, order, page, limit, products;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('::: get Products in Controller');
                        searchParams = new URLSearchParams(req.query);
                        searchOpt = searchParams.get('search');
                        order = searchParams.get('order');
                        page = searchParams.get('page');
                        limit = searchParams.get('limit');
                        return [4 /*yield*/, services_1.ProductService.getProducts(searchOpt, order, {
                                page: page,
                                limit: limit,
                            })];
                    case 1:
                        products = _a.sent();
                        console.log('order : ', order);
                        console.log('search : ', searchOpt);
                        console.log('page : ', page);
                        res.status(200).json({ products: products });
                        return [2 /*return*/];
                }
            });
        });
    };
    ProductController.prototype.isProductInputValid = function (productDTO) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO
                return [2 /*return*/, true];
            });
        });
    };
    return ProductController;
}());
exports.default = new ProductController();
