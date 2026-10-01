import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** 検索窓に打つ語としては十分に長い。これを超えたら上流に投げない。 */
const MAX_QUERY_LENGTH = 100;
const UPSTREAM_TIMEOUT_MS = 3000;
/** 同じ語の候補はそう変わらない。CDN に 1 時間持たせる。 */
const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

function json(data: string[], status = 200): NextResponse {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": status === 200 ? CACHE_CONTROL : "no-store",
    },
    status,
  });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const q = request.nextUrl.searchParams.get("q") ?? "";

  if (!q.trim()) {
    return json([]);
  }

  if (q.length > MAX_QUERY_LENGTH) {
    return json([], 400);
  }

  let res: Response;

  try {
    res = await fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&hl=ja&q=${encodeURIComponent(`${q} レシピ`)}`,
      { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS) },
    );
  } catch (error) {
    const timedOut =
      error instanceof DOMException && error.name === "TimeoutError";

    console.error("[suggest] upstream request failed", error);

    return json([], timedOut ? 504 : 502);
  }

  if (!res.ok) {
    console.error(`[suggest] upstream responded ${res.status}`);

    return json([], 502);
  }

  try {
    const buffer = await res.arrayBuffer();
    const text = new TextDecoder("shift-jis").decode(buffer);
    const data: unknown = JSON.parse(text);

    // OpenSearch format: ["query", ["suggestion1", "suggestion2", ...]]
    if (!Array.isArray(data) || !Array.isArray(data[1])) {
      throw new Error("unexpected shape");
    }

    const suggestions = [
      ...new Set(
        (data[1] as unknown[])
          .filter((s): s is string => typeof s === "string")
          .map((s) => s.replace(/\s*レシピ/g, "").trim())
          .filter(Boolean),
      ),
    ];

    return json(suggestions);
  } catch (error) {
    console.error("[suggest] could not read the upstream response", error);

    return json([], 502);
  }
}
