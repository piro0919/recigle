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
  const controllerRef = useRef<AbortController>(undefined);

  const updateSuggestions = useCallback(
    (q: string) => {
      // 前の入力のぶんは捨てる。遅れて届いた古い候補で上書きしない。
      controllerRef.current?.abort();
      controllerRef.current = undefined;
      clearTimeout(timerRef.current);

      if (!q.trim()) {
        setSuggestions(
          histories.map((value) => ({ type: "history" as const, value })),
        );

        return;
      }

      timerRef.current = setTimeout(async () => {
        const controller = new AbortController();

        controllerRef.current = controller;

        try {
          const res = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`, {
            signal: controller.signal,
          });

          if (!res.ok) {
            throw new Error(`status ${res.status}`);
          }

          const json: unknown = await res.json();
          const data = Array.isArray(json)
            ? json.filter((s): s is string => typeof s === "string")
            : [];

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
          if (controller.signal.aborted) {
            return;
          }

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

    return () => {
      clearTimeout(timerRef.current);
      controllerRef.current?.abort();
    };
  }, [query, updateSuggestions]);

  return { query, setQuery, suggestions };
}
