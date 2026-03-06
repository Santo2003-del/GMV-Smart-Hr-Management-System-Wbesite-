const Redis = require('ioredis');

// Fallback to local Redis if no environment variable is provided
// We use a low maxRetriesPerRequest and a custom retryStrategy to avoid fatal crashes locally
const redisOptions = {
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
        if (times > 3) {
            // Stop retrying after 3 attempts to avoid blocking the process
            return null;
        }
        return Math.min(times * 100, 2000);
    },
    enableOfflineQueue: false // Prevent commands from piling up if Redis is down
};

const ENABLE_REDIS = process.env.USE_REDIS !== 'false';

const redisClient = ENABLE_REDIS
    ? new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', redisOptions)
    : null;

let redisReady = false;
let hasWarned = false;

if (redisClient) {
    redisClient.on('error', (err) => {
        // Only log the warning once to avoid cluttering terminal
        if (!redisReady && !hasWarned && redisClient.status === 'connecting') {
            if (process.env.NODE_ENV === 'development') {
                console.warn('ℹ️  Redis not found locally. Rate limiting will fallback to memory store.');
            } else {
                console.warn('⚠️  Redis connection failed. Rate limiting will fallback to memory store.');
            }
            hasWarned = true;
        }
        redisReady = false;
    });

    redisClient.on('connect', () => {
        redisReady = true;
        console.log('✅ Redis connected for rate limiting');
    });
} else {
    if (!hasWarned) {
        console.log('ℹ️  Redis is disabled via USE_REDIS=false. Using memory store for rate limiting.');
        hasWarned = true;
    }
}

module.exports = {
    redisClient,
    isRedisReady: () => redisReady
};
