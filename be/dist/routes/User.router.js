"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_controller_1 = require("../controllers/user.controller");
//test api
function default_1(app) {
    app.get('/', function (req, res) { return res.json('Hello!'); });
    app.get('/users', user_controller_1.listUsers);
}
exports.default = default_1;
