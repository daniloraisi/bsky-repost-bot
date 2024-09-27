// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  like,
  listMentions,
  login,
  repost,
  searchTags,
} from "./bsky-client.ts";
import {
  AppBskyFeedDefs,
  AppBskyNotificationListNotifications,
} from "npm:@atproto/api";
import { mentionReposted, saveMention } from "./redis-client.ts";

interface Record {
  reply: {
    parent: {
      uri: string;
      cid: string;
    };
  };
}

async function processMensions(
  mentions: AppBskyNotificationListNotifications.Notification[],
) {
  for (const mention of mentions) {
    const exists = await mentionReposted(mention.cid);

    if (exists) {
      console.log(`Already reposted: ${mention.cid}`);
      continue;
    }

    const target = (mention.record as Record).reply?.parent || mention;

    await repost(target.uri, target.cid);

    await saveMention(mention.cid);
  }
}

async function processTags(tags: AppBskyFeedDefs.PostView[]) {
  for (const tag of tags) {
    const exists = await mentionReposted(tag.cid);
    const liked = tag.viewer?.like;

    if (exists && liked) {
      console.log(`Already reposted: ${tag.cid}`);
      continue;
    }

    await like(tag.uri, tag.cid);
    await repost(tag.uri, tag.cid);
    await saveMention(tag.cid);
  }
}

Deno.serve(async (_req) => {
  try {
    await login();

    const mentions = await listMentions();

    await processMensions(mentions);

    const tags = await searchTags();

    await processTags(tags);

    return new Response(JSON.stringify({ message: "Process completed." }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      headers: { "Content-Type": "application/json" },
      status: error.status || 500,
    });
  }
});
