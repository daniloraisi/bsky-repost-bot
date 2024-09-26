import { Redis } from "npm:@upstash/redis";

const redis = new Redis({
  url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
  token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
});

export async function mentionReposted(cid: string) {
  const exists = await redis.exists(cid);

  return exists === 1;
}

export async function saveMention(cid: string) {
  await redis.set(cid, "r");
}
