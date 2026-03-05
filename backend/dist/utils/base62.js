"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeBase62 = encodeBase62;
const BASE62_CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function encodeBase62(num) {
    if (num === 0n)
        return BASE62_CHARSET[0];
    let encoded = '';
    let n = num;
    const base = BigInt(BASE62_CHARSET.length);
    while (n > 0n) {
        const remainder = Number(n % base);
        encoded = BASE62_CHARSET[remainder] + encoded;
        n = n / base;
    }
    return encoded;
}
