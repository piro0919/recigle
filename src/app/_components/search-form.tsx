"use client";

import type { FormEvent, ReactNode } from "react";
import { useCallback } from "react";
import usePwa from "use-pwa";
import Button from "@/app/_components/button";
import SuggestionsDropdown from "@/app/_components/suggestions-dropdown";
import useSearchHistory from "@/hooks/use-search-history";
import useSuggestions from "@/hooks/use-suggestions";
import buildSearchUrl from "@/lib/build-search-url";

type SearchFormProps = {
  blacklist: string[];
};

export default function SearchForm({ blacklist }: SearchFormProps): ReactNode {
  const { canInstall, install } = usePwa();
  const { addHistory, histories, removeHistory } = useSearchHistory();
  const { query, setQuery, suggestions } = useSuggestions(histories);

  const handleSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();

      if (!trimmed) {
        return;
      }

      addHistory(trimmed);

      const url = buildSearchUrl(trimmed, blacklist);

      window.open(url, "_blank", "noopener,noreferrer");
    },
    [addHistory, blacklist],
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      handleSearch(query);
    },
    [handleSearch, query],
  );

  return (
    <form onSubmit={handleSubmit}>
      <SuggestionsDropdown
        onRemoveHistory={removeHistory}
        onSearch={handleSearch}
        onValueChange={setQuery}
        suggestions={suggestions}
        value={query}
      />
      <div className="grid auto-cols-auto grid-flow-col justify-center gap-4 pt-7">
        <Button type="submit">レシグル 検索</Button>
        {canInstall ? (
          <Button onClick={install}>レシグル インストール</Button>
        ) : null}
      </div>
    </form>
  );
}
