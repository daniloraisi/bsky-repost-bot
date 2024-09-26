import { AtpAgent } from "npm:@atproto/api";

const agent = new AtpAgent({
  service: Deno.env.get("ATPROTO_SERVICE_URL")!,
});

export async function login() {
  await agent.login({
    identifier: Deno.env.get("BSKY_IDENTIFIER")!,
    password: Deno.env.get("BSKY_APP_PASSWORD")!,
  });
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

export async function repost(uri: string, cid: string) {
  await agent.repost(uri, cid);
}
