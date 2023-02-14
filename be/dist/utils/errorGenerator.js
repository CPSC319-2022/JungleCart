"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorGenerator = function (obj) {
    var error = new Error(obj.message);
    error.statusCode = obj.statusCode;
    throw error;
};
exports.default = errorGenerator;
