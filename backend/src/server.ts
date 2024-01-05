import express, {Application} from 'express';
import { PORT } from "./config/secrets";
import { errorHandler, notFound } from "./middlewares/errorMiddleware";
import cors from 'cors';

import authRouter from './routes/auth';
import userRouter from './routes/user';
import followRouter from "./routes/follow";

class Server {
    private app: Application;
    private readonly port: number;

    // Routes
    private readonly authRoute = '/api/auth';
    private readonly userRoute = '/api/user';
    private readonly followRoute = '/api/follow';

    constructor() {
        this.app = express();
        this.port = PORT;
    }

    basicMiddleware() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
    }

    errorHandler() {
        this.app.use(notFound);
        this.app.use(errorHandler);
    }

    routes() {
        this.app.use(this.authRoute, authRouter);
        this.app.use(this.userRoute, userRouter);
        this.app.use(this.followRoute, followRouter);
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