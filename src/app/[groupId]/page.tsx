import { api } from "~/trpc/server";
import { AuctionList } from "./_components/AuctionList";

export default async function AuctionListView({ params }: { params: { groupId: string } }) {
  const auctions = await api.auction.list.query({ groupId: params.groupId });

  return (
    <main>
      <AuctionList auctions={auctions} groupId={params.groupId} />
    </main>
  );
}
