import type { ReactNode } from "react";
import Heading from "@/app/_components/heading";
import SearchForm from "@/app/_components/search-form";
import fetchBlacklist from "@/lib/fetch-blacklist";

export default async function Page(): Promise<ReactNode> {
  const blacklist = await fetchBlacklist();

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="w-full max-w-[572px] p-4 tablet:p-6">
        <div className="flex justify-center pb-6">
          <Heading />
        </div>
        <SearchForm blacklist={blacklist} />
      </div>
    </div>
  );
}
