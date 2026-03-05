const BASE62_CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function encodeBase62(num: bigint): string {
    if (num === 0n) return BASE62_CHARSET[0];
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
