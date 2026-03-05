"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUrls = exports.deleteUrl = exports.getAnalytics = exports.resolveUrl = exports.shortenUrl = void 0;
const url_service_1 = __importDefault(require("../services/url.service"));
const zod_1 = require("zod");
const shortenSchema = zod_1.z.object({
    longUrl: zod_1.z.string().url('Invalid URL format'),
    customAlias: zod_1.z.string().min(3).max(10).optional(),
    expiryDate: zod_1.z.string().datetime().optional()
});
const shortenUrl = async (req, res, next) => {
    try {
        const validated = shortenSchema.parse(req.body);
        const url = await url_service_1.default.shortenUrl(validated.longUrl, validated.customAlias, validated.expiryDate);
        // Formatting response based on BigInt fields safely serialized
        const baseDomain = process.env.BASE_DOMAIN || `http://localhost:${process.env.PORT || 5000}`;
        res.status(201).json({
            shortUrl: `${baseDomain}/${url.short_code}`,
            shortCode: url.short_code,
            createdAt: url.created_at,
            expiryDate: url.expiry_at,
            clickCount: url.click_count.toString()
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return next({ status: 400, message: 'Validation Error', errors: error.errors });
        }
        next(error);
    }
};
exports.shortenUrl = shortenUrl;
const resolveUrl = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        const longUrl = await url_service_1.default.resolveUrl(shortCode);
        res.redirect(301, longUrl);
    }
    catch (error) {
        next(error);
    }
};
exports.resolveUrl = resolveUrl;
const getAnalytics = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        const analytics = await url_service_1.default.getAnalytics(shortCode);
        res.status(200).json(analytics);
    }
    catch (error) {
        next(error);
    }
};
exports.getAnalytics = getAnalytics;
const deleteUrl = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        await url_service_1.default.deleteUrl(shortCode);
        res.status(200).json({ message: 'Success' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUrl = deleteUrl;
const listUrls = async (req, res, next) => {
    try {
        const urls = await url_service_1.default.getAllUrls();
        res.status(200).json(urls);
    }
    catch (error) {
        next(error);
    }
};
exports.listUrls = listUrls;
