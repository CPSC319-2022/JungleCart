"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var routes_1 = require("./routes");
var PORT = Number(process.env.PORT) || 8000;
var app = new app_1.ExpressApp([
    new routes_1.AdminRouter(),
    new routes_1.CartRouter(),
    new routes_1.LoginRouter(),
    new routes_1.OrderRouter(),
    new routes_1.ProductRouter(),
    new routes_1.UserRouter(),
]);
app.listen(PORT);
