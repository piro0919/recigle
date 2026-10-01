import parseBlacklist from "@/lib/parse-blacklist";

const BLACKLIST_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1NnSpxI4YFDvB05wa9obH1siqb8szsIwkJIpYuqifMUs/export?format=csv";
/** うまく取れたブラックリストは 1 日使い回す。 */
const REVALIDATE_SECONDS = 60 * 60 * 24;
/** 取れなかったときは、この間隔で取り直す。 */
const RETRY_REVALIDATE_SECONDS = 60 * 5;

async function load(revalidate: number): Promise<string[]> {
  const res = await fetch(BLACKLIST_CSV_URL, { next: { revalidate } });

  if (!res.ok) {
    throw new Error(`status ${res.status}`);
  }

  const contentType = res.headers.get("content-type") ?? "";

  // 共有が切れるとログイン画面の HTML が返る。それを除外語にしない。
  if (!contentType.includes("text/csv")) {
    throw new Error(`content type ${contentType}`);
  }

  const domains = parseBlacklist(await res.text());

  if (domains.length === 0) {
    throw new Error("no domains");
  }

  return domains;
}

export default async function fetchBlacklist(): Promise<string[]> {
  try {
    return await load(REVALIDATE_SECONDS);
  } catch (error) {
    console.error("[blacklist] failed to load, retrying", error);
  }

  // 短い間隔の fetch を混ぜると、ページの再生成もその間隔になる。
  // 失敗した結果を 1 日抱え込まず、数分で取り直せる。
  try {
    return await load(RETRY_REVALIDATE_SECONDS);
  } catch (error) {
    console.error("[blacklist] retry failed, searching without it", error);

    return [];
  }
}
