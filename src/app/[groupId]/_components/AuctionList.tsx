"use client";

import { Auction } from "~/models/Auction";
import { AuctionDetails } from "./Auction";
import { Pagination } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AllFilters } from "./filters/AllFilters";

export const AuctionList = ({
  auctions,
  groupId,
  pages,
  dates,
}: {
  auctions: Auction[];
  groupId: string;
  pages: number;
  dates: { [k: string]: string };
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const setQuery = (name: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (name !== "page") {
      params.delete("page");
    }

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.push(pathname + "?" + params.toString());
  };

  const pageUrl = searchParams.get("page");

  let page = 1;
  if (pageUrl && Number.isInteger(Number.parseInt(pageUrl))) {
    page = Number.parseInt(pageUrl);
  }

  return (
    <>
      <AllFilters dates={dates} setQuery={setQuery} />
      {auctions.map((auction) => (
        <AuctionDetails key={auction.id} auction={auction} groupId={groupId} />
      ))}
      <Pagination
        count={pages}
        page={page}
        onChange={(e, page) => setQuery("page", `${page}`)}
      />
    </>
  );
};
