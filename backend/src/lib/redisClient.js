import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: 'localhost' || process.env.REDIS_URL,
    port: 6379
  }
});

redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.on('connect', () => console.log('Redis connected'));

(async () => {
  await redisClient.connect();
})();

export default redisClient
