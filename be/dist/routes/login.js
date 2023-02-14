"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var routers_1 = require("../utils/routers");
var async_wrap_1 = __importDefault(require("../async-wrap"));
var controllers_1 = require("../controllers");
var LoginRouter = /** @class */ (function (_super) {
    __extends(LoginRouter, _super);
    function LoginRouter() {
        var _this = this;
        var path = '';
        var router = (0, express_1.Router)();
        _this = _super.call(this, path, router) || this;
        router.post('/login', (0, async_wrap_1.default)(controllers_1.LoginController.googleLogin));
        router.post('/logout', (0, async_wrap_1.default)(controllers_1.LoginController.logout));
        return _this;
    }
    return LoginRouter;
}(routers_1.PathRouter));
exports.default = LoginRouter;
