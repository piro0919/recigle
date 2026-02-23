export default function buildSearchUrl(
  query: string,
  blacklist: string[],
): string {
  const exclusions = blacklist.map((d) => `-site:${d}`).join(" ");
  const q = `${query} レシピ ${exclusions}`.trim().replace(/\s+/g, " ");

  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}
