"use client";

import type { MouseEventHandler, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit";
};

export default function Button({
  children,
  onClick,
  type = "button",
}: ButtonProps): ReactNode {
  return (
    <button
      className="h-9 rounded bg-grey-bg border border-grey-bg px-4 text-sm text-grey-button hover:border-grey-border"
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
