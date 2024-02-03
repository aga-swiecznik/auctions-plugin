import { Box } from "@mui/material";
import { AuctionForm } from "~/app/_components/AuctionForm";
import { api } from "~/trpc/server";

export default async function AuctionPost({ params }: { params: { postId: string } }) {
  //const session = await getServerAuthSession();
  const auction = await api.auction.get.query({ postId: params.postId });

  if(!auction) {
    return  <Box sx={{ m: 1 }}>
      <h1>Dodaj nową aukcję</h1>

      <AuctionForm id={params.postId} />
    </Box>
  }

  return (
    <Box sx={{ m: 1 }}>
      <h1>{auction.name}</h1>

      <AuctionForm auction={auction} />
    </Box>
  );
}
