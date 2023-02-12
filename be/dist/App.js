"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressApp = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var PORT = process.env.PORT || 10010;
var allowedOrigins = ["http://localhost:".concat(PORT)];
var corsOption = {
    origin: '*',
};
var ExpressApp = /** @class */ (function () {
    function ExpressApp(routers) {
        var _this = this;
        this.app = (0, express_1.default)();
        this.app.use((0, cors_1.default)(corsOption));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.json());
        this.app.get('/ping', function (req, res) {
            res.json({ message: 'pong' });
        });
        routers.forEach(function (router) {
            _this.app.use("/v2" + router.path, router.router);
        });
    }
    ExpressApp.prototype.listen = function (port) {
        this.app.listen(PORT, function () {
            console.log("Server is listening on ".concat(PORT));
        });
    };
    return ExpressApp;
}());
exports.ExpressApp = ExpressApp;
