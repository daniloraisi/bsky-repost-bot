const TAG = Deno.env.get("BSKY_TAG")!;
const EXTRAS = Deno.env.get("BSKY_EXTRAS")!;

function stringToLucene(value: string) {
  const words = value.split(",");

  return words.length === 1 ? value : words.join("|");
}

export const LUCENE = stringToLucene(`${TAG},${EXTRAS}`);
export const TAGS = LUCENE.split("|");
