import { Request, Response, NextFunction } from 'express';

export const getHealth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({
            status: 'healthy',
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            error: (error as any).message
        });
    }
};
