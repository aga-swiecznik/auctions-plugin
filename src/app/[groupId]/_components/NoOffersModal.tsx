'use client';

import { EmojiEvents, Close, WorkOff } from "@mui/icons-material";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Modal, Stack } from "@mui/material";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { Chip } from "@mui/material";
import { useAuctionMutation } from "~/utils/useAuctionMutation";
import { useRouter } from "next/router";
import useCopyDialog from "~/app/useCopyDialog";

interface Props {
  auctionId: string;
  noOffers: boolean;
}

export const NoOffersModal = ({auctionId, noOffers} : Props) => {
  const { setText } = useCopyDialog();
  const updateMutation = useAuctionMutation(() => {
    !noOffers && setText(modalText);
  });

  const toggleNoOffer = () => {
    updateMutation.mutate({ auction: { id: auctionId, noOffers: !noOffers }});
  }

  const modalText = `Szkoda, że tym razem się nie udało 🥹 Proszę, nie rezygnuj z pomocy 🫶🏼
  Możesz wystawić licytacje w grupie TeamLeonaDlaBruna, która również
  wspiera Bruna w walce o terapię genową 💪
  https://www.facebook.com/groups/licytacjedlaleonasma/
  Może tym razem się uda. Nigdy się nie poddajemy‼️
  Dziękujemy z całego serca ❤💙`

  return <>
    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
      Bez ofert: {" "}
    </Box>
    <Tooltip title={noOffers ? "Bez ofert": "Kliknij, aby zamknąć bez ofert"}>
      <IconButton size="small" onClick={toggleNoOffer} sx={{ opacity: noOffers ? 1 : 0.3 }}>
        <WorkOff />
      </IconButton>
    </Tooltip>
  </>
}