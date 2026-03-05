export interface UrlRecord {
    id: bigint;
    long_url: string;
    short_code: string;
    click_count: bigint;
    created_at: Date;
    last_accessed_at: Date | null;
    expiry_at: Date | null;
}

class UrlRepository {
    private urlList: UrlRecord[] = [];
    private currentId = 0n;

    async createUrl(longUrl: string, shortCode: string, expiryAt?: Date): Promise<UrlRecord> {
        this.currentId++;
        const newUrl: UrlRecord = {
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

    async findByShortCode(shortCode: string): Promise<UrlRecord | null> {
        const url = this.urlList.find(u => u.short_code === shortCode);
        return url || null;
    }

    async incrementClickCount(shortCode: string): Promise<UrlRecord | null> {
        const urlIndex = this.urlList.findIndex(u => u.short_code === shortCode);
        if (urlIndex === -1) return null;

        this.urlList[urlIndex].click_count++;
        this.urlList[urlIndex].last_accessed_at = new Date();
        return this.urlList[urlIndex];
    }

    async deleteByShortCode(shortCode: string): Promise<UrlRecord | null> {
        const urlIndex = this.urlList.findIndex(u => u.short_code === shortCode);
        if (urlIndex === -1) {
            const err: any = new Error('URL not found');
            err.code = 'P2025';
            throw err;
        }

        const deletedUrl = this.urlList[urlIndex];
        this.urlList.splice(urlIndex, 1);
        return deletedUrl;
    }

    async getLatestId(): Promise<bigint> {
        return this.currentId;
    }

    async getAllUrls(): Promise<UrlRecord[]> {
        // Return sorted by created_at desc
        return [...this.urlList].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    }
}

export default new UrlRepository();
