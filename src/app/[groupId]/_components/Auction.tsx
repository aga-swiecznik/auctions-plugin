import { ArrowUpward, AttachMoney, Check, EmojiEvents, Facebook, MarkEmailRead, Money, PriceCheck, ScheduleSend } from "@mui/icons-material";
import { Badge, Box, Card, CardActions, CardContent, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { TypeChip } from "~/app/_components/AuctionType";
import { DateSelector } from "~/app/_components/DateSelector";
import { Auction } from "~/models/Auction";
import { WinnerModal } from "./WinnerModal";

export const AuctionDetails = ({ auction, groupId }: { auction: Auction, groupId: string }) => {


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
          <DateSelector date={auction.endsAt} />
        </Grid>
      </Grid>
    </CardContent>
    <CardActions>
      <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
        <Box>
          {/* <Tooltip title="Niepodbite"><IconButton size="small"><ArrowUpward /></IconButton></Tooltip> */}
          { auction.winnerAmount ? <>
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Opłacone?
            </Box>
            { auction.paid ?
              <Tooltip title="Opłacone">
                  <IconButton size="small" color="success" ><PriceCheck /></IconButton>
              </Tooltip>
              :
              <Tooltip title="Nieopłacone"><IconButton size="small" color="error"><AttachMoney /></IconButton></Tooltip> 
            }
          </> : null }

          {auction.winnerAmount ? <>
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Odebrane?
            </Box>
            { auction.collected ?
              <Tooltip title="Odebrane">
                  <IconButton size="small" color="success" ><MarkEmailRead /></IconButton>
              </Tooltip>
              :
              <Tooltip title="Nie odebrane"><IconButton size="small" color="error"><ScheduleSend /></IconButton></Tooltip> 
            }
          </> : null }

          <WinnerModal
            auctionId={auction.id}
            groupId={groupId}
            winnerAmount={auction.winnerAmount}
            winnerName={auction.winnerName} />
        </Box>
        <Tooltip title="Zobacz post">
          <Link href={`https://facebook.com/groups/${groupId}/posts/${auction.id}`}><IconButton size="small"><Facebook /></IconButton>
          </Link>
        </Tooltip>
      </Stack>
    </CardActions>
  </Card>
}