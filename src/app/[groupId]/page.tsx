'use client';

import { api } from "~/trpc/react";
import { AuctionList } from "./_components/AuctionList";

export default function AuctionListView({ params }: { params: { groupId: string } }) {
  const { data: auctions } = api.auction.list.useQuery({ groupId: params.groupId });
  return (
    <main>
      <AuctionList auctions={auctions ?? []} groupId={params.groupId} />
    </main>
  );
}
