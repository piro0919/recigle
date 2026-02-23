"use client";

import type { ReactNode } from "react";
import { FiClock } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { MdSearch } from "react-icons/md";

export type Suggestion = {
  type: "history" | "search";
  value: string;
};

type SuggestionItemProps = {
  highlighted: boolean;
  onClickRemove?: (value: string) => void;
  onSelect: (value: string) => void;
  suggestion: Suggestion;
};

export default function SuggestionItem({
  highlighted,
  onClickRemove,
  onSelect,
  suggestion,
}: SuggestionItemProps): ReactNode {
  const { type, value } = suggestion;

  return (
    <li className={`flex items-center ${highlighted ? "bg-highlight" : ""}`}>
      <button
        className="grid h-9 flex-1 cursor-pointer grid-cols-[48px_1fr] items-center bg-transparent"
        onClick={() => onSelect(value)}
        type="button"
      >
        <span className="flex items-center justify-center text-grey-icon">
          {type === "history" ? <FiClock size={16} /> : <MdSearch size={16} />}
        </span>
        <span className="truncate text-left text-sm">{value}</span>
      </button>
      {type === "history" && onClickRemove ? (
        <button
          className="flex items-center justify-center bg-transparent px-3 text-grey-secondary"
          onClick={() => onClickRemove(value)}
          type="button"
        >
          <IoCloseOutline size={18} />
        </button>
      ) : null}
    </li>
  );
}
