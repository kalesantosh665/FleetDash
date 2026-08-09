import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

export const publisher = redisClient;

export const subscriber = createClient({
  url: process.env.REDIS_URL,
});

publisher.on("connect", () => {
  console.log("🟢 Redis Publisher Connected");
});

subscriber.on("connect", () => {
  console.log("🟢 Redis Subscriber Connected");
});

publisher.on("error", (err) => {
  console.error(err);
});

subscriber.on("error", (err) => {
  console.error(err);
});