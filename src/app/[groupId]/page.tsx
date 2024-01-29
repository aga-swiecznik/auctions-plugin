import { api } from "~/trpc/server";
import { AuctionDetails } from "./_components/Auction";

export default async function AuctionList({ params }: { params: { groupId: string } }) {
  //const session = await getServerAuthSession();
  const auctions = await api.auction.list.query({ groupId: params.groupId });

  return (
    <main>
      {auctions.map(auction => <AuctionDetails key={params.groupId} auction={auction} groupId={params.groupId} />)}
    </main>
  );
}
