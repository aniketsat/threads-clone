import {config} from "dotenv";
config();

export const PORT = parseInt(process.env.PORT as string, 10) || 8000;