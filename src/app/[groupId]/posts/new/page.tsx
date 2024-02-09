import { KeyboardBackspace } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import Link from "next/link";
import { AuctionForm } from "~/app/_components/AuctionForm";
import { api } from "~/trpc/server";

export default async function AuctionPost({ params }: { params: { groupId: string } }) {
  //const session = await getServerAuthSession();

  return (
    <Box sx={{ m: 1 }}>
      <h1>
        <Link href={`/${params.groupId}/`}><IconButton><KeyboardBackspace /></IconButton></Link>
        Dodaj nową aukcję
      </h1>
      <AuctionForm groupId={params.groupId} />
    </Box>
  );
}
