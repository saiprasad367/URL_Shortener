"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const url_controller_1 = require("../controllers/url.controller");
const health_controller_1 = require("../controllers/health.controller");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = (0, express_1.Router)();
// API V1 Routes
router.post('/api/v1/shorten', rateLimiter_1.apiLimiter, url_controller_1.shortenUrl);
router.get('/api/v1/analytics/:shortCode', url_controller_1.getAnalytics);
router.delete('/api/v1/:shortCode', url_controller_1.deleteUrl);
router.get('/api/v1/urls', url_controller_1.listUrls);
// Health Route
router.get('/health', health_controller_1.getHealth);
// Resolve Route (Root level)
// This goes last to avoid matching /api or /health or /metrics
router.get('/:shortCode', url_controller_1.resolveUrl);
exports.default = router;
