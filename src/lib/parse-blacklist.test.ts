import { describe, expect, it } from "vitest";
import parseBlacklist from "@/lib/parse-blacklist";

describe("parseBlacklist", () => {
  it("reads one domain per line", () => {
    expect(parseBlacklist("cookpad.com\nrecipe.rakuten.co.jp\n")).toEqual([
      "cookpad.com",
      "recipe.rakuten.co.jp",
    ]);
  });

  it("handles CRLF, quotes, extra columns and case", () => {
    expect(parseBlacklist('"Cookpad.com",memo\r\nnote.com\r\n')).toEqual([
      "cookpad.com",
      "note.com",
    ]);
  });

  it("drops duplicates and blank lines", () => {
    expect(parseBlacklist("note.com\n\n  \nnote.com")).toEqual(["note.com"]);
  });

  it("drops lines that do not look like domains", () => {
    const html = '<!DOCTYPE html>\n<html lang="ja">\n<title>Sign in</title>';

    expect(parseBlacklist(html)).toEqual([]);
    expect(parseBlacklist("domain\nhttps://a.com\nlocalhost\na b.com")).toEqual(
      [],
    );
  });
});
