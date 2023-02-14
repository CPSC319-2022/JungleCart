"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockUserModel = exports.UserModel = exports.MockProductModel = exports.ProductModel = exports.MockAdminModel = exports.AdminModel = void 0;
var admin_1 = __importDefault(require("./admin"));
exports.AdminModel = admin_1.default;
var mock_admin_1 = __importDefault(require("./mock.admin"));
exports.MockAdminModel = mock_admin_1.default;
//import CartModel from './cart'
//import LoginModel from './login'
//import OrderModel from './order'
var product_1 = __importDefault(require("./product"));
exports.ProductModel = product_1.default;
var mock_product_1 = __importDefault(require("./mock.product"));
exports.MockProductModel = mock_product_1.default;
var user_1 = __importDefault(require("./user"));
exports.UserModel = user_1.default;
var mock_user_1 = __importDefault(require("./mock.user"));
exports.MockUserModel = mock_user_1.default;
