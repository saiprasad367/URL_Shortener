import { Request, Response, NextFunction } from 'express';
import urlService from '../services/url.service';
import { z } from 'zod';

const shortenSchema = z.object({
    longUrl: z.string().url('Invalid URL format'),
    customAlias: z.string().min(3).max(10).optional(),
    expiryDate: z.string().datetime().optional()
});

export const shortenUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = shortenSchema.parse(req.body);
        const url = await urlService.shortenUrl(validated.longUrl, validated.customAlias, validated.expiryDate);

        // Formatting response based on BigInt fields safely serialized
        const baseDomain = process.env.BASE_DOMAIN || `http://localhost:${process.env.PORT || 5000}`;
        res.status(201).json({
            shortUrl: `${baseDomain}/${url.short_code}`,
            shortCode: url.short_code,
            createdAt: url.created_at,
            expiryDate: url.expiry_at,
            clickCount: url.click_count.toString()
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return next({ status: 400, message: 'Validation Error', errors: error.errors });
        }
        next(error);
    }
};

export const resolveUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { shortCode } = req.params;
        const longUrl = await urlService.resolveUrl(shortCode);
        res.redirect(301, longUrl);
    } catch (error) {
        next(error);
    }
};

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { shortCode } = req.params;
        const analytics = await urlService.getAnalytics(shortCode);
        res.status(200).json(analytics);
    } catch (error) {
        next(error);
    }
};

export const deleteUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { shortCode } = req.params;
        await urlService.deleteUrl(shortCode);
        res.status(200).json({ message: 'Success' });
    } catch (error) {
        next(error);
    }
};

export const listUrls = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const urls = await urlService.getAllUrls();
        res.status(200).json(urls);
    } catch (error) {
        next(error);
    }
};
