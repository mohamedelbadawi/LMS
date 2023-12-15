import { Redis } from "ioredis";
require("dotenv").config();
const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log("Redis connected successfully");
    return process.env.REDIS_URL;
  } else {
    throw new Error("Redis Connection failed");
  }
};

export const redis = new Redis(redisClient());
