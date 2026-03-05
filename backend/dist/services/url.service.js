"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlService = void 0;
const url_repository_1 = __importDefault(require("../repositories/url.repository"));
const base62_1 = require("../utils/base62");
const logger_1 = __importDefault(require("../utils/logger"));
class UrlService {
    async shortenUrl(longUrl, customAlias, expiryDate) {
        let shortCode = customAlias;
        const expiryAt = expiryDate ? new Date(expiryDate) : undefined;
        if (shortCode) {
            const existing = await url_repository_1.default.findByShortCode(shortCode);
            if (existing) {
                throw { status: 409, message: 'Custom alias already exists' };
            }
        }
        else {
            // Generate using Base62
            const latestId = await url_repository_1.default.getLatestId();
            // Increase logical ID by 1 to get next encoded value
            shortCode = (0, base62_1.encodeBase62)(latestId + 1n);
            // Safety check for collisions
            let collisionCheck = await url_repository_1.default.findByShortCode(shortCode);
            let attempts = 1;
            while (collisionCheck) {
                shortCode = (0, base62_1.encodeBase62)(latestId + 1n + BigInt(attempts));
                collisionCheck = await url_repository_1.default.findByShortCode(shortCode);
                attempts++;
            }
        }
        const url = await url_repository_1.default.createUrl(longUrl, shortCode, expiryAt);
        return url;
    }
    async resolveUrl(shortCode) {
        const url = await url_repository_1.default.findByShortCode(shortCode);
        if (!url) {
            throw { status: 404, message: 'URL not found' };
        }
        if (url.expiry_at && url.expiry_at < new Date()) {
            throw { status: 410, message: 'URL has expired' };
        }
        // Increment click count async without awaiting to return fast
        url_repository_1.default.incrementClickCount(shortCode).catch(err => logger_1.default.error('Error incrementing click count', err));
        return url.long_url;
    }
    async getAnalytics(shortCode) {
        const url = await url_repository_1.default.findByShortCode(shortCode);
        if (!url) {
            throw { status: 404, message: 'URL not found' };
        }
        return {
            shortCode: url.short_code,
            longUrl: url.long_url,
            createdAt: url.created_at,
            expiryDate: url.expiry_at,
            clickCount: url.click_count.toString(), // Serialize bigInt safely
            lastAccessedAt: url.last_accessed_at,
        };
    }
    async deleteUrl(shortCode) {
        await url_repository_1.default.deleteByShortCode(shortCode).catch((e) => {
            if (e.code === 'P2025')
                throw { status: 404, message: 'URL not found' };
            throw e;
        });
        return true;
    }
    async getAllUrls() {
        const urls = await url_repository_1.default.getAllUrls();
        return urls.map(url => ({
            ...url,
            click_count: url.click_count.toString() // Serialize bigint explicitly
        }));
    }
}
exports.UrlService = UrlService;
exports.default = new UrlService();
