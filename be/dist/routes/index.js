"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = exports.ProductRouter = exports.OrderRouter = exports.LoginRouter = exports.CartRouter = exports.AdminRouter = void 0;
var admin_1 = __importDefault(require("./admin"));
exports.AdminRouter = admin_1.default;
var cart_1 = __importDefault(require("./cart"));
exports.CartRouter = cart_1.default;
var login_1 = __importDefault(require("./login"));
exports.LoginRouter = login_1.default;
var order_1 = __importDefault(require("./order"));
exports.OrderRouter = order_1.default;
var product_1 = __importDefault(require("./product"));
exports.ProductRouter = product_1.default;
var user_1 = __importDefault(require("./user"));
exports.UserRouter = user_1.default;
