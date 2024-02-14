import { AttachMoney, Facebook, MarkEmailRead, PriceCheck, ScheduleSend } from "@mui/icons-material";
import { Box, Card, CardActions, CardContent, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { TypeChip } from "~/app/_components/AuctionType";
import { DateSelector } from "~/app/_components/DateSelector";
import { Auction } from "~/models/Auction";
import { WinnerModal } from "./WinnerModal";
import { useAuctionMutation } from "~/utils/useAuctionMutation";
import { NoOffersModal } from "./NoOffersModal";

export const AuctionDetails = ({ auction, groupId }: { auction: Auction, groupId: string }) => {
  const updateMutation = useAuctionMutation();

  const toggleCollected = () => {
    updateMutation.mutate({ auction: { id: auction.id, collected: !auction.collected }})
  };

  const togglePaid = () => {
    updateMutation.mutate({ auction: { id: auction.id, paid: !auction.paid }})
  };

  // TODO archive

  return <Card variant="outlined" sx={{ mb: 1, mx: 1 }}>
    <CardContent>
      <Grid container justifyContent="space-between" gap={2}>
        <Grid item flexGrow={{ xs: 0, sm: 1 }} xs={7} sm="auto">
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
        </Grid>
        <Grid item xs={4} sm="auto" sx={{ textAlign: 'right' }}>
          <TypeChip auctionId={auction.id} type={auction.type} />
        </Grid>
        <Grid item xs={12} sm="auto" sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
          <DateSelector date={auction.endsAt} auctionId={auction.id} />
        </Grid>
      </Grid>
    </CardContent>
    <CardActions sx={{ px: 2}}>
      <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
        <Stack direction="row" gap={2}>
          {/* <Tooltip title="Niepodbite"><IconButton size="small"><ArrowUpward /></IconButton></Tooltip> */}
          { auction.winnerAmount ? <Box onClick={togglePaid}>
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Opłacone?
            </Box>
            { auction.paid ?
              <Tooltip title="Opłacone">
                  <IconButton size="small" color="success"><PriceCheck /></IconButton>
              </Tooltip>
              :
              <Tooltip title="Nieopłacone">
                <IconButton size="small" color="error"><AttachMoney /></IconButton>
              </Tooltip>
            }
          </Box> : null }
          {auction.winnerAmount ? <Box onClick={toggleCollected}>
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Odebrane?
            </Box>
            { auction.collected ?
              <Tooltip title="Odebrane">
                <IconButton size="small" color="success">
                  <MarkEmailRead />
                </IconButton>
              </Tooltip>
              :
              <Tooltip title="Nie odebrane">
                <IconButton size="small" color="error"><ScheduleSend /></IconButton>
              </Tooltip>
            }
          </Box> : null }
          { !!!auction.winnerAmount && <NoOffersModal auctionId={auction.id} noOffers={auction.noOffers} />}
          { !auction.noOffers && <Box>
            <WinnerModal
              auctionId={auction.id}
              winnerAmount={auction.winnerAmount}
              winnerName={auction.winnerName} />
          </Box> }
        </Stack>
        <Tooltip title="Zobacz post">
          <Link href={auction.link}><IconButton size="small"><Facebook /></IconButton>
          </Link>
        </Tooltip>
      </Stack>
    </CardActions>
  </Card>
}