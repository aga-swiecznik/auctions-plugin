'use client';

import { KeyboardBackspace } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import { Box, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { AuctionForm } from "~/app/_components/AuctionForm";
import { api } from "~/trpc/react";

export default function AuctionPost({ params }: { params: { postId: string, groupId: string } }) {
  const { data: auction, isLoading } = api.auction.get.useQuery({ postId: params.postId });
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

      <AuctionForm id={params.postId} groupId={params.groupId} />
    </Box>);
  }

  return (
    <Box sx={{ m: 1 }}>
      <h1>
        <IconButton onClick={() => router.back()}><KeyboardBackspace /></IconButton>
        {auction.name}
      </h1>

      <AuctionForm auction={auction} groupId={params.groupId} id={params.postId} />
    </Box>
  );
}
