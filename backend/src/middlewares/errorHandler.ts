import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message, { stack: err.stack, path: req.path });

    const status = err.status || 500;
    const message = status === 500 ? 'Internal Server Error' : err.message;

    res.status(status).json({
        error: message,
        details: err.errors // Include detailed Zod validation messages
    });
};
