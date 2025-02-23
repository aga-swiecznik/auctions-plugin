'use client';

import { KeyboardBackspace } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { AuctionForm } from "~/app/_components/AuctionForm";

interface Props {
  params: { fundraisingId: string }
}

export default async function AuctionPost({ params: { fundraisingId } }: Props) {
  const router = useRouter();

  return (
    <Box sx={{ m: 1 }}>
      <h1>
        <IconButton onClick={() => router.back()}><KeyboardBackspace /></IconButton>
        Dodaj nową aukcję
      </h1>
      <AuctionForm fundraisingId={fundraisingId} />
    </Box>
  );
}
