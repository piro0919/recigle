import type { ReactNode } from "react";
import About from "@/app/_components/about";
import Heading from "@/app/_components/heading";
import SearchForm from "@/app/_components/search-form";
import fetchBlacklist from "@/lib/fetch-blacklist";

export default async function Page(): Promise<ReactNode> {
  const blacklist = await fetchBlacklist();

  return (
    <div className="flex h-dvh items-center justify-center overflow-y-auto">
      <div className="w-full max-w-[572px] p-4 tablet:p-6">
        <div className="flex justify-center pb-6">
          <Heading />
        </div>
        <SearchForm blacklist={blacklist} />
        <div className="flex justify-center pt-10">
          <About />
        </div>
      </div>
    </div>
  );
}
