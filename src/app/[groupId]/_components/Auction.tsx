import { Facebook } from "@mui/icons-material";
import { Box, Card, CardActions, CardContent, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { Auction } from "~/models/Auction";
import { WinnerModal } from "./WinnerModal";
import { NoOffersModal } from "./NoOffersModal";
import { PaidModal } from "./PaidModal";
import { MoreAuctionsMenu } from "./MoreActionsMenu";
import dayjs from "dayjs";

export const AuctionDetails = ({ auction, groupId }: { auction: Auction, groupId: string }) => {
  let link = auction.link;

  if (link.indexOf('share_url') > 0) {
    link = decodeURIComponent(link.slice(link.indexOf('share_url') + 10));
  }

  return <Card variant="outlined" sx={{ mb: 1 }}>
    <CardContent sx={{ py: 1 }}>
      <Typography component="p" sx={{
        verticalAlign: 'middle',
        lineHeight: '32px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}>
        <Link href={`/${groupId}/posts/${auction.id}`}>
          <strong>{auction.orderNumber}. {auction.name}</strong>
        </Link>
      </Typography>
      <Typography sx={{display: { md: 'none' }}}>
      Koniec: {dayjs(auction.endsAt).format('ddd, DD.MM')}
      </Typography>
    </CardContent>
    <CardActions sx={{ px: 2}}>
      <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
        <Stack direction="row" gap={2}>
          { !!auction.winnerAmount && <PaidModal auctionId={auction.id} paid={auction.paid} />}
          { !!!auction.winnerAmount && <NoOffersModal auctionId={auction.id} noOffers={auction.noOffers} noOffersYet={auction.noOffersYet} />}
          { !auction.noOffers && <Box>
            <WinnerModal
              auctionId={auction.id}
              winnerAmount={auction.winnerAmount}
              winner={auction.winner} />
          </Box> }
          <MoreAuctionsMenu auction={auction} />
        </Stack>
        <Tooltip title="Zobacz post">
          <Link href={link.replace('m.facebook', 'www.facebook')} target="_blank"><IconButton size="small"><Facebook /></IconButton>
          </Link>
        </Tooltip>
      </Stack>
    </CardActions>
  </Card>
}