"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = exports.ProductService = exports.AdminService = void 0;
var admin_1 = __importDefault(require("./admin"));
exports.AdminService = admin_1.default;
//import CartService from './cart';
//import LoginService from './login';
//import OrderService from './order';
var product_1 = __importDefault(require("./product"));
exports.ProductService = product_1.default;
var user_1 = __importDefault(require("./user"));
exports.UserService = user_1.default;
