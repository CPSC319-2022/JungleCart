'use strict';
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
var awsServerlessExpress = require('aws-serverless-express');
var server = awsServerlessExpress.createServer(app);
app.listen(PORT);
exports.handler = function (event, context) {
    console.log('Events : ' + JSON.stringify(event));
    awsServerlessExpress.proxy(server, event, context);
};
