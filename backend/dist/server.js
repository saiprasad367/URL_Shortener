"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./utils/logger"));
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        const server = app_1.default.listen(PORT, () => {
            logger_1.default.info(`Server is running on port ${PORT}`);
        });
        // Graceful shutdown
        const shutdown = async () => {
            logger_1.default.info('Shutting down server...');
            server.close(async () => {
                logger_1.default.info('HTTP server closed');
                process.exit(0);
            });
        };
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    }
    catch (error) {
        logger_1.default.error('Failed to start server', error);
        process.exit(1);
    }
};
startServer();
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger_1.default.error('Uncaught Exception', err);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.default.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
