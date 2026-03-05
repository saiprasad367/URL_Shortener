"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealth = void 0;
const getHealth = async (req, res, next) => {
    try {
        res.status(200).json({
            status: 'healthy',
            uptime: process.uptime()
        });
    }
    catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            error: error.message
        });
    }
};
exports.getHealth = getHealth;
