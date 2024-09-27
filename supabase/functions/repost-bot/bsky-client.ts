import { AtpAgent, AtpSessionData } from "npm:@atproto/api";
import { LUCENE, TAGS } from "./config/index.ts";
import { getPreviousSession, saveSession } from "./redis-client.ts";

const agent = new AtpAgent({
  service: Deno.env.get("ATPROTO_SERVICE_URL")!,
});

export async function login() {
  let response;
  const previousSession = await getPreviousSession();
  if (previousSession) {
    response = await agent.resumeSession(previousSession as AtpSessionData);
  }

  if (!response?.success) {
    response = await agent.login({
      identifier: Deno.env.get("BSKY_IDENTIFIER")!,
      password: Deno.env.get("BSKY_APP_PASSWORD")!,
    });
    await saveSession(response.data as AtpSessionData);
  }
}

export async function listMentions() {
  const response = await agent.listNotifications();

  if (response.success) {
    const { notifications } = response.data;
    const mentions = notifications.filter(
      (notification) => notification.reason === "mention",
    );

    return mentions;
  }

  return [];
}

export async function searchTags() {
  const response = await agent.app.bsky.feed.searchPosts({
    q: LUCENE,
    tag: TAGS,
    limit: 100,
  });

  if (response.success) {
    const { posts } = response.data;

    return posts;
  }

  return [];
}

export async function like(uri: string, cid: string) {
  await agent.like(uri, cid);
}

export async function repost(uri: string, cid: string) {
  await agent.repost(uri, cid);
}
