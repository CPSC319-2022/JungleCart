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
var OrderRouter = /** @class */ (function (_super) {
    __extends(OrderRouter, _super);
    function OrderRouter() {
        var _this = this;
        var path = '/orders';
        var router = (0, express_1.Router)();
        _this = _super.call(this, path, router) || this;
        router.post('/', (0, async_wrap_1.default)(controllers_1.OrderController.addOrder));
        router.delete('/:id', (0, async_wrap_1.default)(controllers_1.OrderController.deleteOrderById));
        router.get('/:id', (0, async_wrap_1.default)(controllers_1.OrderController.getOrderInfoById));
        router.put('/:id', (0, async_wrap_1.default)(controllers_1.OrderController.updateOrderInfoById));
        router.post('/:id/checkout', (0, async_wrap_1.default)(controllers_1.OrderController.checkoutOrderById));
        router.get('/', (0, async_wrap_1.default)(controllers_1.OrderController.getOrders));
        return _this;
    }
    return OrderRouter;
}(routers_1.PathRouter));
exports.default = OrderRouter;
