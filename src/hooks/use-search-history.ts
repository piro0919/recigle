"use client";

import { useCallback } from "react";
import useLocalStorage from "@/hooks/use-local-storage";

const MAX_HISTORY = 10;

export default function useSearchHistory(): {
  addHistory: (query: string) => void;
  histories: string[];
  removeHistory: (query: string) => void;
} {
  const [histories, setHistories] = useLocalStorage<string[]>("histories", []);

  const addHistory = useCallback(
    (query: string) => {
      const trimmed = query.trim().replace(/\s+/g, " ");

      if (!trimmed) {
        return;
      }

      setHistories((prev) => {
        const filtered = prev.filter((h) => h !== trimmed);

        return [trimmed, ...filtered].slice(0, MAX_HISTORY);
      });
    },
    [setHistories],
  );

  const removeHistory = useCallback(
    (query: string) => {
      setHistories((prev) => prev.filter((h) => h !== query));
    },
    [setHistories],
  );

  return { addHistory, histories, removeHistory };
}
