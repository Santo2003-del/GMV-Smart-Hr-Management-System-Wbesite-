const rateLimit = require('express-rate-limit');
const { default: RedisStore } = require('rate-limit-redis');
const { redisClient, isRedisReady } = require('../config/redisClient');

/**
 * Creates a rate limiter with optional Redis store fallback.
 */
const createRateLimiter = (options) => {
    const { windowMs, max, message, redisKeyPrefix = 'rl:' } = options;

    const limiterOptions = {
        windowMs,
        max: process.env.DISABLE_RATE_LIMIT === 'true' ? 999999 : max,
        message,
        standardHeaders: true,
        legacyHeaders: false,
    };

    // Only use RedisStore if Redis is explicitly enabled and the client exists
    const useRedis = process.env.USE_REDIS !== 'false' && redisClient;

    if (useRedis && (process.env.REDIS_URL || isRedisReady())) {
        try {
            limiterOptions.store = new RedisStore({
                sendCommand: (...args) => {
                    if (!isRedisReady()) {
                        throw new Error('Redis not ready');
                    }
                    return redisClient.call(...args);
                },
                prefix: redisKeyPrefix,
            });
        } catch (err) {
            console.warn(`⚠️ Failed to initialize RedisStore for ${redisKeyPrefix}, falling back to MemoryStore.`);
        }
    }

    return rateLimit(limiterOptions);
};

module.exports = { createRateLimiter };
