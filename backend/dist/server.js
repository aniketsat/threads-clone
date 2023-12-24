"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const secrets_1 = require("./config/secrets");
class Server {
    // Routes
    // private readonly apiDocsRoute = '/api/docs';
    // private readonly authRoute = '/api/auth';
    // private readonly userRoute = '/api/user';
    constructor() {
        this.app = (0, express_1.default)();
        this.port = secrets_1.PORT;
    }
    basicMiddleware() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    routes() {
        this.app.use('/', (req, res) => {
            res.send("Hello World");
        });
    }
    start() {
        this.app.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }
}
const server = new Server();
server.basicMiddleware();
server.routes();
server.start();
