import { ArrowUpward, AttachMoney, Facebook } from "@mui/icons-material";
import { Box, Card, CardActions, CardContent, IconButton, Stack, Tooltip } from "@mui/material";
import Link from "next/link";
import { TypeChip } from "~/app/_components/AuctionType";
import { DateSelector } from "~/app/_components/DateSelector";
import { Auction } from "~/models/Auction";

export const AuctionDetails = ({ auction, groupId }: { auction: Auction, groupId: string }) => {
  return <Card variant="outlined" sx={{ mb: 1, mx: 1 }}>
    <CardContent>
      <Stack direction="row" justifyContent="space-between">
        <Link href={`/${groupId}/posts/${auction.id}`}>
          <strong>{ auction.name }</strong>
        </Link>
        <TypeChip auctionId={auction.id} type={auction.type} />
      </Stack>
      <Stack direction="row" alignItems="center" gap={1} mt={2}>
        <DateSelector date={auction.endsAt} />{" "}
      </Stack>
    </CardContent>
    <CardActions>
      <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
        <Box>
          <Tooltip title="Niepodbite"><IconButton size="small"><ArrowUpward /></IconButton></Tooltip>
          <Tooltip title="Nieopłacone"><IconButton size="small" ><AttachMoney /></IconButton></Tooltip>
        </Box>
        <Tooltip title="Zobacz post">
          <Link href={`https://facebook.com/groups/${groupId}/posts/${auction.id}`}><IconButton size="small"><Facebook /></IconButton>
          </Link>
        </Tooltip>
      </Stack>
    </CardActions>
  </Card>
}