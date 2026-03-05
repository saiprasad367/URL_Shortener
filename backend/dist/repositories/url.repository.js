"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UrlRepository {
    urlList = [];
    currentId = 0n;
    async createUrl(longUrl, shortCode, expiryAt) {
        this.currentId++;
        const newUrl = {
            id: this.currentId,
            long_url: longUrl,
            short_code: shortCode,
            click_count: 0n,
            created_at: new Date(),
            last_accessed_at: null,
            expiry_at: expiryAt || null,
        };
        this.urlList.push(newUrl);
        return newUrl;
    }
    async findByShortCode(shortCode) {
        const url = this.urlList.find(u => u.short_code === shortCode);
        return url || null;
    }
    async incrementClickCount(shortCode) {
        const urlIndex = this.urlList.findIndex(u => u.short_code === shortCode);
        if (urlIndex === -1)
            return null;
        this.urlList[urlIndex].click_count++;
        this.urlList[urlIndex].last_accessed_at = new Date();
        return this.urlList[urlIndex];
    }
    async deleteByShortCode(shortCode) {
        const urlIndex = this.urlList.findIndex(u => u.short_code === shortCode);
        if (urlIndex === -1) {
            const err = new Error('URL not found');
            err.code = 'P2025';
            throw err;
        }
        const deletedUrl = this.urlList[urlIndex];
        this.urlList.splice(urlIndex, 1);
        return deletedUrl;
    }
    async getLatestId() {
        return this.currentId;
    }
    async getAllUrls() {
        // Return sorted by created_at desc
        return [...this.urlList].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    }
}
exports.default = new UrlRepository();
