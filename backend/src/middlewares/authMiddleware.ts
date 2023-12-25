import {verifyToken} from "../utils/token";
import {JWT_ACCESS_SECRET} from "../config/secrets";
import {NextFunction, Request, Response} from "express";

const protect = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

    try {
        // @ts-ignore
        req.user = verifyToken(token, JWT_ACCESS_SECRET);
        next();
    } catch (error) {
        // @ts-ignore
        if (error.name !== 'TokenExpiredError') {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
        res.status(403);
        throw new Error('Not authorized, token expired');
    }
}


export { protect };