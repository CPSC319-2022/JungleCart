"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = exports.ProductController = exports.OrderController = exports.LoginController = exports.CartController = exports.AdminController = void 0;
var admin_1 = __importDefault(require("./admin"));
exports.AdminController = admin_1.default;
var cart_1 = __importDefault(require("./cart"));
exports.CartController = cart_1.default;
var login_1 = __importDefault(require("./login"));
exports.LoginController = login_1.default;
var order_1 = __importDefault(require("./order"));
exports.OrderController = order_1.default;
var product_1 = __importDefault(require("./product"));
exports.ProductController = product_1.default;
var user_1 = __importDefault(require("./user"));
exports.UserController = user_1.default;
