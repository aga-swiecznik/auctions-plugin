import { AttachMoney, Delete, Facebook, MarkEmailRead, PriceCheck, ScheduleSend } from "@mui/icons-material";
import { Box, Card, CardActions, CardContent, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { TypeChip } from "~/app/_components/AuctionType";
import { DateSelector } from "~/app/_components/DateSelector";
import { Auction } from "~/models/Auction";
import { WinnerModal } from "./WinnerModal";
import { useAuctionMutation } from "~/utils/useAuctionMutation";
import { NoOffersModal } from "./NoOffersModal";
import { PaidModal } from "./PaidModal";

export const AuctionDetails = ({ auction, groupId }: { auction: Auction, groupId: string }) => {
  const updateMutation = useAuctionMutation();

  const toggleArchived = () => {
    updateMutation.mutate({ auction: { id: auction.id, archived: !auction.archived }})
  };

  return <Card variant="outlined" sx={{ mb: 1 }}>
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
              <strong>{auction.orderNumber}. {auction.name}</strong>
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={4} sm="auto" sx={{ textAlign: 'right' }}>
          <TypeChip auctionId={auction.id} type={auction.type} />
        </Grid>
        <Grid item xs={12} sm="auto" sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
          <Stack direction="row" justifyContent="space-between">
            <DateSelector date={auction.endsAt} auctionId={auction.id} />

            <Box onClick={toggleArchived}>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, ml: 2 }}>
                Usunięte?
              </Box>
              { auction.archived ?
                <Tooltip title="Usunięte">
                  <IconButton size="small" color="error"><Delete /></IconButton>
                </Tooltip>
                :
                <Tooltip title="Usuń">
                  <IconButton size="small" color="error" sx={{ opacity: 0.5 }}><Delete /></IconButton>
                </Tooltip>
              }
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </CardContent>
    <CardActions sx={{ px: 2}}>
      <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
        <Stack direction="row" gap={2}>
          {/* <Tooltip title="Niepodbite"><IconButton size="small"><ArrowUpward /></IconButton></Tooltip> */}
          { !!auction.winnerAmount && <PaidModal auctionId={auction.id} paid={auction.paid} />}

          {/* {auction.winnerAmount ? <Box onClick={toggleCollected}>
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
              <Tooltip title="Nieodebrane">
                <IconButton size="small" color="error"><ScheduleSend /></IconButton>
              </Tooltip>
            }
          </Box> : null } */}
          { !!!auction.winnerAmount && <NoOffersModal auctionId={auction.id} noOffers={auction.noOffers} noOffersYet={auction.noOffersYet} />}
          { !auction.noOffers && <Box>
            <WinnerModal
              auctionId={auction.id}
              winnerAmount={auction.winnerAmount}
              winner={auction.winner} />
          </Box> }
        </Stack>
        <Tooltip title="Zobacz post">
          <Link href={auction.link.replace('m.facebook', 'www.facebook')}><IconButton size="small"><Facebook /></IconButton>
          </Link>
        </Tooltip>
      </Stack>
    </CardActions>
  </Card>
}