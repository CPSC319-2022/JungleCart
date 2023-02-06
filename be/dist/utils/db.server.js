"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var client_1 = require("@prisma/client");
var globalAny = global;
if (!globalAny.__db) {
    globalAny.__db = new client_1.PrismaClient();
}
var db = globalAny.__db;
exports.db = db;
