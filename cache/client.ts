import { Redis } from "@upstash/redis";

export const redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
})

export const prefixRedis = process.env.development ? "insight:" : ""