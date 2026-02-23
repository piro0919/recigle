import type { ReactNode } from "react";

export default function Heading(): ReactNode {
  return (
    <h1 className="font-shimizu text-7xl tracking-normal tablet:text-8xl">
      <span className="text-red">レ</span>
      <span className="text-yellow">シ</span>
      <span className="text-green">グ</span>
      <span className="text-red">ル</span>
    </h1>
  );
}
