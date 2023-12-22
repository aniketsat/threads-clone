import express, {Application} from 'express';
import { PORT } from "./config/secrets";


class Server {
    private app: Application;
    private readonly port: number;

    // Routes
    // private readonly apiDocsRoute = '/api/docs';
    // private readonly authRoute = '/api/auth';
    // private readonly userRoute = '/api/user';

    constructor() {
        this.app = express();
        this.port = PORT;
    }

    basicMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
    }

    routes() {
        this.app.use('/', (req, res) => {
           res.send("Hello World")
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