import express, {Application} from 'express';
import { PORT } from "./config/secrets";
import { errorHandler, notFound } from "./middlewares/errorMiddleware";

import authRouter from './routes/auth';

class Server {
    private app: Application;
    private readonly port: number;

    // Routes
    private readonly authRoute = '/api/auth';
    // private readonly userRoute = '/api/user';

    constructor() {
        this.app = express();
        this.port = PORT;
    }

    basicMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
    }

    errorHandler() {
        this.app.use(notFound);
        this.app.use(errorHandler);
    }

    routes() {
        this.app.use(this.authRoute, authRouter);
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
server.errorHandler();
server.start();