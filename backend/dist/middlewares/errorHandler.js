"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler = (err, req, res, next) => {
    logger_1.default.error(err.message, { stack: err.stack, path: req.path });
    const status = err.status || 500;
    const message = status === 500 ? 'Internal Server Error' : err.message;
    res.status(status).json({
        error: message,
    });
};
exports.errorHandler = errorHandler;
