import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.NODE_ENV === "production" ? process.env.REDIS_URL : 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.on('connect', () => console.log('Redis connected'));

(async () => {
  await redisClient.connect();
})();

export default redisClient
