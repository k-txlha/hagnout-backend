import { createClient } from "redis";

/**
 * Redis client instance configured using environment variables.
 * Connects automatically on import.
 */
const redisUrl = `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSKEY}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

const redisClient = createClient({ url: redisUrl });

redisClient.on("error", (err) => console.error("❌ Redis Client Error:", err));

await redisClient.connect();

export default redisClient;
