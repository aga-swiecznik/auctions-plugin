"use client";

import { api } from "~/trpc/react";
import { AuctionList } from "./_components/AuctionList";
import { useRouter, useSearchParams } from "next/navigation";
import { useApiQuery } from "~/utils/api";

interface Props {
  params: { fundraisingId: string }
}

export default function AuctionListView({
  params,
}: Props) {
  const searchParams = useSearchParams();
  const auctionType = searchParams.get("type") || undefined;
  const selectedDate = searchParams.get("selectedDate") || undefined;
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;
  const author = searchParams.get("author") || undefined;
  const pageUrl = searchParams.get("page") || "1";
  const selectedDateObj = selectedDate ? new Date(selectedDate) : undefined;
  
  const { data: auctions } = api.auction.list.useQuery({
    fundraisingId: params.fundraisingId,
    auctionType,
    author,
    ends: selectedDateObj,
    search,
    status,
    page: Number.isInteger(Number.parseInt(pageUrl))
      ? Number.parseInt(pageUrl)
      : 1,
  });

  return (
    <main>
      <AuctionList
        auctions={auctions?.auctions ?? []}
        pages={auctions?.pages ?? 1}
        fundraisingId={params.fundraisingId}
        dates={auctions?.dates ?? {}}
      />
    </main>
  );
}
