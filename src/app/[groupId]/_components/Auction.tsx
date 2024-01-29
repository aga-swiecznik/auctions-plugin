import { Facebook } from "@mui/icons-material";
import { Card, CardActions, CardContent, IconButton, Stack } from "@mui/material";
import Link from "next/link";
import { TypeChip } from "~/app/_components/AuctionType";
import { DateSelector } from "~/app/_components/DateSelector";
import { StatusChip } from "~/app/_components/Status";
import { Auction } from "~/models/Auction";

export const AuctionDetails = ({ auction, groupId }: { auction: Auction, groupId: string }) => {
  return <Card variant="outlined" sx={{ mb: 1, mx: 1 }}>
    <CardContent>
      <Link href={`/${groupId}/posts/${auction.id}`}>
        <strong>{ auction.name }</strong>
      </Link>
      <Stack direction="row" alignItems="center" gap={1} mt={2}>
        <DateSelector date={auction.endsAt} />{" "}
        <StatusChip auctionId={auction.id} status={auction.status} />{" "}
        <TypeChip auctionId={auction.id} type={auction.type} />
      </Stack>
    </CardContent>
    <CardActions>
      <Link href={`https://facebook.com/groups/${groupId}/posts/${auction.id}`}><IconButton size="small"><Facebook /></IconButton></Link>
    </CardActions>
  </Card>
}