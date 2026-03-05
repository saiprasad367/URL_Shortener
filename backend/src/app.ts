import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import promClient from 'prom-client';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import logger from './utils/logger';

const app = express();

// Prometheus Registry
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Custom Metrics
const requestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(requestDuration);

app.use(cors());
app.use(helmet());
app.use(express.json());

// Log incoming requests and measure duration
app.use((req, res, next) => {
    const start = process.hrtime();
    res.on('finish', () => {
        const diff = process.hrtime(start);
        const duration = diff[0] + diff[1] / 1e9;
        requestDuration.labels(req.method, req.route ? req.route.path : req.path, res.statusCode.toString()).observe(duration);
        logger.info({
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

app.use(routes);

app.use(errorHandler);

export default app;
