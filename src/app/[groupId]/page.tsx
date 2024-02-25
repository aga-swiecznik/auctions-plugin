'use client';

import { api } from "~/trpc/react";
import { AuctionList } from "./_components/AuctionList";
import { useRouter } from "next/navigation";

export default function AuctionListView({ params }: { params: { groupId: string } }) {
  const router = useRouter();
  const { data: auctions, error } = api.auction.list.useQuery({ groupId: params.groupId });

  if(error && error.data?.code === 'UNAUTHORIZED') {
    router.push('/api/auth/signin');
  }

  return (
    <main>
      <AuctionList auctions={auctions ?? []} groupId={params.groupId} />
    </main>
  );
}
