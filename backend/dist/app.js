"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const prom_client_1 = __importDefault(require("prom-client"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
// Prometheus Registry
const register = new prom_client_1.default.Registry();
prom_client_1.default.collectDefaultMetrics({ register });
// Custom Metrics
const requestDuration = new prom_client_1.default.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(requestDuration);
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
// Log incoming requests and measure duration
app.use((req, res, next) => {
    const start = process.hrtime();
    res.on('finish', () => {
        const diff = process.hrtime(start);
        const duration = diff[0] + diff[1] / 1e9;
        requestDuration.labels(req.method, req.route ? req.route.path : req.path, res.statusCode.toString()).observe(duration);
        logger_1.default.info({
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration,
        });
    });
    next();
});
// Metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});
app.use(routes_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
