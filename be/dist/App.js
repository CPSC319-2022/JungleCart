"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var router_1 = __importDefault(require("./routes/router"));
var db_1 = require("./utils/db");
dotenv_1.default.config();
var PORT = parseInt(process.env.PORT, 10) || 3306;
if (!process.env.PORT) {
    process.exit(1);
}
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.listen(PORT, function () {
    console.log("listening on port ".concat(PORT));
    (0, db_1.connect)();
    (0, router_1.default)(app);
});
// export class App {
//   private app: Application
//   constructor() {
//     // this.app = express()
//     this.middlewares()
//     this.routes()
//   }
//   middlewares() {
//     this.app.use(morga('dev'))
//   }
//   routes() {
//     this.app.use(router)
//   }
//   async listen() {
//     await this.app.listen(PORT)
//     console.log(`listening on port ${PORT}`)
//     // connect()
//     // router(app)
//   }
// }
