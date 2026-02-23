"use client";

import type { InputHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { forwardRef } from "react";
import { MdClose, MdSearch } from "react-icons/md";

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  onReset: MouseEventHandler<HTMLButtonElement>;
  wrapperClassName?: string;
};

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    { onReset, wrapperClassName, ...props },
    ref,
  ): ReactNode {
    return (
      <div
        className={`grid h-11 grid-cols-[48px_1fr_48px] items-center rounded-3xl border border-grey-border transition-shadow duration-200 focus-within:shadow-dropdown ${wrapperClassName ?? ""}`}
      >
        <span className="flex items-center justify-center text-grey-icon">
          <MdSearch size={20} />
        </span>
        <input
          {...props}
          className="w-full border-none text-base outline-none"
          ref={ref}
          type="search"
        />
        <button
          className="flex items-center justify-center bg-transparent text-grey-icon"
          onClick={onReset}
          type="button"
        >
          <MdClose size={20} />
        </button>
      </div>
    );
  },
);

export default SearchInput;
