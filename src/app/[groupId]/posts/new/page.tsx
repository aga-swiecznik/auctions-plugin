'use client';

import { KeyboardBackspace } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { AuctionForm } from "~/app/_components/AuctionForm";

export default async function AuctionPost({ params }: { params: { groupId: string } }) {
  const router = useRouter();

  return (
    <Box sx={{ m: 1 }}>
      <h1>
        <IconButton onClick={() => router.back()}><KeyboardBackspace /></IconButton>
        Dodaj nową aukcję
      </h1>
      <AuctionForm groupId={params.groupId} />
    </Box>
  );
}
