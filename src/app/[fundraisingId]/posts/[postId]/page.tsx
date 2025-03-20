'use client';

import { KeyboardBackspace } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import { Box, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { AuctionForm } from "~/app/_components/AuctionForm";
import { api } from "~/trpc/react";

interface Props { params: { postId: string, fundraisingId: string } }

export default function AuctionPost({ params: { postId, fundraisingId } }: Props) {
  const { data: auction, isLoading } = api.auction.get.useQuery({ postId: postId, fundraisingId });
  const router = useRouter();

  if (isLoading) {
    return <Box sx={{ width: '100%' }}>
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
    </Box>;
  }

  if(!auction) {
    return (<Box sx={{ m: 1 }}>
      <h1>
        <IconButton onClick={() => router.back()}><KeyboardBackspace /></IconButton>
        Dodaj nową aukcję
      </h1>

      <AuctionForm fundraisingId={fundraisingId} />
    </Box>);
  }

  return (
    <Box sx={{ m: 1 }}>
      <h1>
        <IconButton onClick={() => router.back()}><KeyboardBackspace /></IconButton>
        {auction.name}
      </h1>

      <AuctionForm auction={auction} fundraisingId={fundraisingId} />
    </Box>
  );
}
