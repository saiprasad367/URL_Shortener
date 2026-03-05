import { Router } from 'express';
import { shortenUrl, resolveUrl, getAnalytics, deleteUrl, listUrls } from '../controllers/url.controller';
import { getHealth } from '../controllers/health.controller';
import { apiLimiter } from '../middlewares/rateLimiter';

const router = Router();

// API V1 Routes
router.post('/api/v1/shorten', apiLimiter, shortenUrl);
router.get('/api/v1/analytics/:shortCode', getAnalytics);
router.delete('/api/v1/:shortCode', deleteUrl);
router.get('/api/v1/urls', listUrls);

// Health Route
router.get('/health', getHealth);

// Resolve Route (Root level)
// This goes last to avoid matching /api or /health or /metrics
router.get('/:shortCode', resolveUrl);

export default router;
