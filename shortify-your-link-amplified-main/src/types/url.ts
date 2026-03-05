export interface ShortenedUrl {
  id: string;
  shortUrl: string;
  originalUrl: string;
  alias?: string;
  clicks: number;
  createdAt: string;
  expiresAt?: string;
  status: "active" | "expired";
}
