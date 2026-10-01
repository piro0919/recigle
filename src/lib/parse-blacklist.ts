const DOMAIN_PATTERN =
  /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

/**
 * ブラックリストの CSV を読み、ドメインだけを返す。
 * 1 列目だけを見る。ドメインの形をしていない行は捨てる。
 */
export default function parseBlacklist(csv: string): string[] {
  const domains = csv
    .split(/\r?\n/)
    .map((line) =>
      (line.split(",")[0] ?? "").trim().replace(/^"|"$/g, "").toLowerCase(),
    )
    .filter((line) => DOMAIN_PATTERN.test(line));

  return [...new Set(domains)];
}
