import { api } from "~/trpc/server";

export default async function AuctionPost({ params }: { params: { postId: string } }) {
  //const session = await getServerAuthSession();
  const auction = await api.auction.get.query({ postId: params.postId });

  if(!auction) {
    return <>Dodaj nową aukcję</>
  }

  return (
    <main>
      {params.postId}
    </main>
  );
}
