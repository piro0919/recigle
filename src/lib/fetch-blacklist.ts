const BLACKLIST_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1NnSpxI4YFDvB05wa9obH1siqb8szsIwkJIpYuqifMUs/export?format=csv";

export default async function fetchBlacklist(): Promise<string[]> {
  try {
    const res = await fetch(BLACKLIST_CSV_URL, {
      next: { revalidate: 86400 },
    });
    const csv = await res.text();

    return csv
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}
