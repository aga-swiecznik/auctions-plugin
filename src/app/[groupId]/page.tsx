"use client";

import { api } from "~/trpc/react";
import { AuctionList } from "./_components/AuctionList";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuctionListView({
  params,
}: {
  params: { groupId: string }
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auctionType = searchParams.get("type") || undefined;
  const selectedDate = searchParams.get("selectedDate") || undefined;
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;
  const author = searchParams.get("author") || undefined;
  const pageUrl = searchParams.get("page") || "1";
  const selectedDateObj = selectedDate ? new Date(selectedDate) : undefined;

  const { data: auctions, error } = api.auction.list.useQuery({
    groupId: params.groupId,
    auctionType,
    author,
    ends: selectedDateObj,
    search,
    status,
    page: Number.isInteger(Number.parseInt(pageUrl))
      ? Number.parseInt(pageUrl)
      : 1,
  });

  if (error && error.data?.code === "UNAUTHORIZED") {
    router.push("/api/auth/signin");
  }

  return (
    <main>
      <AuctionList
        auctions={auctions?.auctions ?? []}
        pages={auctions?.pages ?? 1}
        groupId={params.groupId}
        dates={auctions?.dates ?? {}}
      />
    </main>
  );
}
