import { NextFunction, Request, Response } from 'express';
import { NODE_ENV } from "../config/secrets";


const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  let message = err.message;
  if (err.name === 'ValidationError') {
      message = message.split(': ')[2].split(',')[0].split('Path ')[1] + ' is required';
  } else if (err.name === 'CastError') {
      message = 'Invalid ' + message.split(' ')[0];
  } else if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
      statusCode = 403;
      message = 'Token expired';
  } else {
      message = 'Something went wrong';
  }

  res.status(statusCode).json({
      message,
      stack: NODE_ENV === 'production' ? null : err.stack,
  });
};

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}


export { errorHandler, notFound };