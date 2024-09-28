import { Redis } from "npm:@upstash/redis";
import { AtpSessionData } from "npm:@atproto/api";

const redis = Redis.fromEnv({
  enableAutoPipelining: false,
});

export async function getPreviousSession(): Promise<AtpSessionData> {
  const session = await redis.get(`session-${Deno.env.get("BSKY_IDENTIFIER")}`);

  return session as AtpSessionData;
}

export async function saveSession(session: AtpSessionData) {
  await redis.set(`session-${Deno.env.get("BSKY_IDENTIFIER")}`, session);
}

export async function mentionReposted(cid: string) {
  const exists = await redis.get(cid);

  return exists && exists === "r";
}

export async function saveMention(cid: string) {
  await redis.set(cid, "r");
}
