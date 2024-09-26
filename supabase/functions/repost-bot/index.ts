// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { listMentions, login, repost } from "./bsky-client.ts";
import { Notification } from "npm:@atproto/api/src/client/types/app/bsky/notification/listNotifications";
import { mentionReposted, saveMention } from "./redis-client.ts";

interface Record {
  reply: {
    parent: {
      uri: string;
      cid: string;
    };
  };
}

async function processMensions(mentions: Notification[]) {
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

Deno.serve(async (_req) => {
  await login();

  const mentions = await listMentions();

  await processMensions(mentions);

  return new Response(JSON.stringify({ message: "Process completed." }), {
    headers: { "Content-Type": "application/json" },
  });
});
