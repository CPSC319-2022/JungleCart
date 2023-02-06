"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var User_router_1 = require("./routes/User.router");
dotenv_1.default.config();
if (!process.env.PORT) {
    process.exit(1);
}
var PORT = parseInt(process.env.PORT, 10);
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/users', User_router_1.userRouter);
app.listen(PORT, function () {
    console.log("listening on port ".concat(PORT));
});
// define a route handler for the default home page
app.get('/', function (req, res) {
    res.send('Hello world!!!');
});
