import { Redis } from "npm:@upstash/redis";

const redis = Redis.fromEnv({
  enableAutoPipelining: false,
});

export async function mentionReposted(cid: string) {
  const exists = await redis.get(cid);

  return exists && exists === "r";
}

export async function saveMention(cid: string) {
  await redis.set(cid, "r");
}
