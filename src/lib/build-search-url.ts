export default function buildSearchUrl(
  query: string,
  blacklist: string[],
): string {
  const exclusions = blacklist.map((d) => `-site:${d}`).join(" ");
  const q = `レシピ ${query} ${exclusions}`.trim().replace(/\s+/g, " ");

  return `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;
}
