"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Suggestion } from "@/app/_components/suggestion-item";

const DEBOUNCE_MS = 300;

export default function useSuggestions(histories: string[]): {
  query: string;
  setQuery: (query: string) => void;
  suggestions: Suggestion[];
} {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const updateSuggestions = useCallback(
    (q: string) => {
      if (!q.trim()) {
        setSuggestions(
          histories.map((value) => ({ type: "history" as const, value })),
        );

        return;
      }

      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `/api/suggest?q=${encodeURIComponent(`レシピ ${q}`)}`,
          );
          const data: string[] = await res.json();

          const trimmedQuery = q.trim().replace(/\s+/g, " ");

          const historyMatches = histories
            .filter((h) => h.startsWith(trimmedQuery))
            .map((value) => ({ type: "history" as const, value }));

          const searchSuggestions = data
            .filter((s) => !histories.includes(s))
            .map((value) => ({ type: "search" as const, value }));

          setSuggestions(
            [...historyMatches, ...searchSuggestions].slice(0, 10),
          );
        } catch {
          setSuggestions(
            histories.map((value) => ({ type: "history" as const, value })),
          );
        }
      }, DEBOUNCE_MS);
    },
    [histories],
  );

  useEffect(() => {
    updateSuggestions(query);

    return () => clearTimeout(timerRef.current);
  }, [query, updateSuggestions]);

  return { query, setQuery, suggestions };
}
