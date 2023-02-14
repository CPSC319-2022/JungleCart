"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//change below
var MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
var MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'jungle_cart';
var MYSQL_USER = process.env.MYSQL_USER || 'root';
var MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '1234';
var SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
var SERVER_PORT = 3306;
var MYSQL = {
    host: MYSQL_HOST,
    database: MYSQL_DATABASE,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
};
var SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
};
var config = {
    mysql: MYSQL,
    server: SERVER,
};
exports.default = config;
