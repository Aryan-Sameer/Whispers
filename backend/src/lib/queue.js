import { Queue } from 'bullmq';

const redisUrlStr = process.env.NODE_ENV === "production"
  ? process.env.REDIS_URL
  : (process.env.REDIS_DEV_URL || 'redis://localhost:6379');

let connectionOpts = {};

if (redisUrlStr) {
  try {
    const parsed = new URL(redisUrlStr);
    connectionOpts = {
      host: parsed.hostname,
      port: parsed.port ? parseInt(parsed.port, 10) : 6379,
      username: parsed.username || undefined,
      password: parsed.password || undefined,
    };
  } catch (err) {
    console.error("Failed to parse Redis URL for BullMQ connection, using default:", err);
    connectionOpts = {
      host: 'localhost',
      port: 6379
    };
  }
} else {
  connectionOpts = {
    host: 'localhost',
    port: 6379
  };
}

export const connection = connectionOpts;

export const messageQueue = new Queue('messages', { connection });
