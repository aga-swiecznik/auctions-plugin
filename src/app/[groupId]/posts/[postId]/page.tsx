import { KeyboardBackspace } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import Link from "next/link";
import { AuctionForm } from "~/app/_components/AuctionForm";
import { api } from "~/trpc/server";

export default async function AuctionPost({ params }: { params: { postId: string, groupId: string } }) {
  //const session = await getServerAuthSession();
  const auction = await api.auction.get.query({ postId: params.postId });

  if(!auction) {
    return (<Box sx={{ m: 1 }}>
      <h1>
        <Link href={`/${params.groupId}/`}><IconButton><KeyboardBackspace /></IconButton></Link>
        Dodaj nową aukcję
      </h1>

      <AuctionForm id={params.postId} groupId={params.groupId} />
    </Box>);
  }

  return (
    <Box sx={{ m: 1 }}>
      <h1>
        <Link href={`/${params.groupId}/`}><IconButton><KeyboardBackspace /></IconButton></Link>
        {auction.name}
      </h1>

      <AuctionForm auction={auction} groupId={params.groupId} id={params.postId} />
    </Box>
  );
}
