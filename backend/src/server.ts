import express, {Application} from 'express';
import { PORT } from "./config/secrets";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    swaggerDefinition: {
        info: {
            title: 'Threads Clone API',
            version: '1.0.0',
            description: 'Swagger API with express',
        },
        host: 'localhost:8000',
        basePath: '/',
    },
    apis: ['./routes/*.ts'],
};

const specs = swaggerJSDoc(options);

class Server {
    private app: Application;
    private readonly port: number;

    // Routes
    private readonly apiDocsRoute = '/api-docs';
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
        this.app.use(this.apiDocsRoute, swaggerUi.serve, swaggerUi.setup(specs));
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