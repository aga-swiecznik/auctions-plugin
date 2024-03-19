'use client';

import { WorkOff, WorkHistory } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { Tooltip } from "@mui/material";
import { useAuctionMutation } from "~/utils/useAuctionMutation";
import useCopyDialog from "~/app/useCopyDialog";

interface Props {
  auctionId: string;
  noOffers: boolean;
  noOffersYet: boolean;
}

export const NoOffersModal = ({auctionId, noOffers, noOffersYet} : Props) => {
  const { setText } = useCopyDialog();
  const updateMutation = useAuctionMutation(() => {
    !noOffers && setText(modalText);
  });

  const toggleNoOffer = () => {
    updateMutation.mutate({ auction: { id: auctionId, noOffers: true }});
  }

  // const toggleNoOfferYet = () => {
  //   updateMutation.mutate({ auction: { id: auctionId, noOffers: false, noOffersYet: true }});
  // }

  const toggleOff = () => {
    updateMutation.mutate({ auction: { id: auctionId, noOffers: false }});
  }

  const modalText = `Szkoda, że tym razem się nie udało 🥹 Proszę, nie rezygnuj z pomocy 🫶🏼
  Możesz wystawić licytacje w grupie TeamLeonaDlaBruna, która również
  wspiera Bruna w walce o terapię genową 💪
  https://www.facebook.com/groups/licytacjedlaleonasma/
  Może tym razem się uda. Nigdy się nie poddajemy‼️
  Dziękujemy z całego serca ❤💙`

  if(!noOffers) {
    return <>
      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
        Bez ofert?: {" "}
      </Box>
      <Tooltip title="Kliknij aby oznaczyć ze nie ma ofert">
        <IconButton size="small" onClick={toggleNoOffer} sx={{ color: '#daca33' }}>
          <WorkHistory />
        </IconButton>
      </Tooltip>
    </>
  }

  return <>
    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
      Bez ofert: {" "}
    </Box>
    <Tooltip title="Kliknij aby odznaczyć">
      <IconButton size="small" onClick={toggleOff} sx={{ color: '#aa0000' }}>
        <WorkOff />
      </IconButton>
    </Tooltip>
  </>
}