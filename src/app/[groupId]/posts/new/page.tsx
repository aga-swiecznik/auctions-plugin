import { Box } from "@mui/material";
import { AuctionForm } from "~/app/_components/AuctionForm";
import { api } from "~/trpc/server";

export default async function AuctionPost({ params }: { params: { groupId: string } }) {
  //const session = await getServerAuthSession();

  return (
    <Box sx={{ m: 1 }}>
      <h1>Dodaj nową aukcję</h1>
      <AuctionForm groupId={params.groupId} />
    </Box>
  );
}
