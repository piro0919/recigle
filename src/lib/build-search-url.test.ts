import { describe, expect, it } from "vitest";
import buildSearchUrl from "@/lib/build-search-url";

function queryOf(url: string): string {
  return new URL(url).searchParams.get("q") ?? "";
}

describe("buildSearchUrl", () => {
  it("appends レシピ and one -site: term per domain", () => {
    const url = buildSearchUrl("肉じゃが", ["cookpad.com", "note.com"]);

    expect(queryOf(url)).toBe(
      "肉じゃが レシピ -site:cookpad.com -site:note.com",
    );
  });

  it("collapses whitespace in the query", () => {
    expect(queryOf(buildSearchUrl("  鶏　 むね肉  ", []))).toBe(
      "鶏 むね肉 レシピ",
    );
  });

  it("encodes the query so symbols survive", () => {
    const url = buildSearchUrl("a&b=c", []);

    expect(url.startsWith("https://www.google.com/search?q=")).toBe(true);
    expect(queryOf(url)).toBe("a&b=c レシピ");
  });
});
