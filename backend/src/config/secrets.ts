import {config} from "dotenv";
config();

export const PORT = parseInt(process.env.PORT as string, 10) || 8000;

export const NODE_ENV = process.env.NODE_ENV as string;

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
export const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN as string;
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN as string;
