import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const q = request.nextUrl.searchParams.get("q") ?? "";

  if (!q.trim()) {
    return NextResponse.json([]);
  }

  try {
    const res = await fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&hl=ja&q=${encodeURIComponent(`${q} レシピ`)}`,
    );

    if (!res.ok) {
      return NextResponse.json([]);
    }

    const buffer = await res.arrayBuffer();
    const text = new TextDecoder("shift-jis").decode(buffer);
    const data = JSON.parse(text);

    // OpenSearch format: ["query", ["suggestion1", "suggestion2", ...]]
    if (Array.isArray(data) && Array.isArray(data[1])) {
      const suggestions = [
        ...new Set(
          (data[1] as string[])
            .map((s) => s.replace(/\s*レシピ/g, "").trim())
            .filter(Boolean),
        ),
      ];

      return NextResponse.json(suggestions);
    }

    return NextResponse.json([]);
  } catch {
    return NextResponse.json([]);
  }
}
