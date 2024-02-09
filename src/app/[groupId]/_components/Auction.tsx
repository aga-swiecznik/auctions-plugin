import { ArrowUpward, AttachMoney, EmojiEvents, Facebook, Money } from "@mui/icons-material";
import { Box, Card, CardActions, CardContent, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TypeChip } from "~/app/_components/AuctionType";
import { DateSelector } from "~/app/_components/DateSelector";
import { Auction } from "~/models/Auction";
import { api } from "~/trpc/react";

export const AuctionDetails = ({ auction, groupId }: { auction: Auction, groupId: string }) => {
  const router = useRouter();
  const updateMutation = api.auction.update.useMutation({
    onSuccess: () => {
      router.refresh();
    }
  });
  return <Card variant="outlined" sx={{ mb: 1, mx: 1 }}>
    <CardContent>
      <Stack direction="row" justifyContent="space-between">
        <Typography component="span" sx={{
          verticalAlign: 'middle',
          lineHeight: '32px',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}>
          <Link href={`/${groupId}/posts/${auction.id}`}>
            <strong>{ auction.name }</strong>
          </Link>
        </Typography>
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
          { !auction.winnerAmount ? <Tooltip title="Nieopłacone"><IconButton size="small" ><AttachMoney /></IconButton></Tooltip> : null }
          <Tooltip title="Wylicytowana kwota"><IconButton size="small" >
            { auction.winnerAmount ? `${auction.winnerAmount}zł` : <EmojiEvents /> }
          </IconButton></Tooltip>
        </Box>
        <Tooltip title="Zobacz post">
          <Link href={`https://facebook.com/groups/${groupId}/posts/${auction.id}`}><IconButton size="small"><Facebook /></IconButton>
          </Link>
        </Tooltip>
      </Stack>
    </CardActions>
  </Card>
}