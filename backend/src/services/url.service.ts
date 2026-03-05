import urlRepository from '../repositories/url.repository';
import { encodeBase62 } from '../utils/base62';
import logger from '../utils/logger';

export class UrlService {
    async shortenUrl(longUrl: string, customAlias?: string, expiryDate?: string) {
        let shortCode = customAlias;
        const expiryAt = expiryDate ? new Date(expiryDate) : undefined;

        if (shortCode) {
            const existing = await urlRepository.findByShortCode(shortCode);
            if (existing) {
                throw { status: 409, message: 'Custom alias already exists' };
            }
        } else {
            // Generate using Base62
            const latestId = await urlRepository.getLatestId();
            // Increase logical ID by 1 to get next encoded value
            shortCode = encodeBase62(latestId + 1n);

            // Safety check for collisions
            let collisionCheck = await urlRepository.findByShortCode(shortCode);
            let attempts = 1;
            while (collisionCheck) {
                shortCode = encodeBase62(latestId + 1n + BigInt(attempts));
                collisionCheck = await urlRepository.findByShortCode(shortCode);
                attempts++;
            }
        }

        const url = await urlRepository.createUrl(longUrl, shortCode, expiryAt);
        return url;
    }

    async resolveUrl(shortCode: string) {
        const url = await urlRepository.findByShortCode(shortCode);
        if (!url) {
            throw { status: 404, message: 'URL not found' };
        }

        if (url.expiry_at && url.expiry_at < new Date()) {
            throw { status: 410, message: 'URL has expired' };
        }

        // Increment click count async without awaiting to return fast
        urlRepository.incrementClickCount(shortCode).catch(err => logger.error('Error incrementing click count', err));

        return url.long_url;
    }

    async getAnalytics(shortCode: string) {
        const url = await urlRepository.findByShortCode(shortCode);
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

    async deleteUrl(shortCode: string) {
        await urlRepository.deleteByShortCode(shortCode).catch((e) => {
            if (e.code === 'P2025') throw { status: 404, message: 'URL not found' };
            throw e;
        });
        return true;
    }

    async getAllUrls() {
        const urls = await urlRepository.getAllUrls();
        return urls.map(url => ({
            ...url,
            click_count: url.click_count.toString() // Serialize bigint explicitly
        }));
    }
}

export default new UrlService();
