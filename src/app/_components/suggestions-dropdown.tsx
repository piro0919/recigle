"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import SearchInput from "@/app/_components/search-input";
import type { Suggestion } from "@/app/_components/suggestion-item";
import SuggestionItem from "@/app/_components/suggestion-item";

type SuggestionsDropdownProps = {
  onRemoveHistory: (value: string) => void;
  onSearch: (query: string) => void;
  onValueChange: (value: string) => void;
  suggestions: Suggestion[];
  value: string;
};

export default function SuggestionsDropdown({
  onRemoveHistory,
  onSearch,
  onValueChange,
  suggestions,
  value,
}: SuggestionsDropdownProps): ReactNode {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();

        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          onSearch(suggestions[highlightedIndex].value);
        } else if (value.trim()) {
          onSearch(value.trim());
        }
      } else if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    },
    [highlightedIndex, onSearch, suggestions, value],
  );

  const handleSelect = useCallback(
    (selectedValue: string) => {
      onSearch(selectedValue);
      setOpen(false);
    },
    [onSearch],
  );

  const handleFocus = useCallback(() => {
    setOpen(true);
    setHighlightedIndex(-1);
  }, []);

  const handleReset = useCallback(() => {
    onValueChange("");
    inputRef.current?.focus();
  }, [onValueChange]);

  const showDropdown = open && suggestions.length > 0;

  return (
    <div className="relative" ref={wrapperRef}>
      <SearchInput
        onChange={(e) => {
          onValueChange(e.currentTarget.value);
          setHighlightedIndex(-1);
        }}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onReset={handleReset}
        placeholder="料理名や食材で検索"
        ref={inputRef}
        value={value}
        wrapperClassName={showDropdown ? "rounded-b-none shadow-dropdown" : ""}
      />
      {showDropdown ? (
        <div className="absolute left-0 z-1 w-full overflow-hidden rounded-b-3xl bg-white shadow-dropdown-below">
          <ul className="py-2">
            {suggestions.map((suggestion, index) => (
              <SuggestionItem
                highlighted={index === highlightedIndex}
                key={`${suggestion.type}-${suggestion.value}`}
                onClickRemove={
                  suggestion.type === "history" ? onRemoveHistory : undefined
                }
                onSelect={handleSelect}
                suggestion={suggestion}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
