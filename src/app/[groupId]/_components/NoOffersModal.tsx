'use client';

import { EmojiEvents, Close, WorkOff } from "@mui/icons-material";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Modal, Stack } from "@mui/material";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { Chip } from "@mui/material";
import { useAuctionMutation } from "~/utils/useAuctionMutation";
import { useRouter } from "next/router";

interface Props {
  auctionId: string;
  noOffers: boolean;
}

export const NoOffersModal = ({auctionId, noOffers} : Props) => {
  const [showModal, setShowModal] = useState<'hidden' | 'summary'>('hidden');
  const updateMutation = useAuctionMutation(() => {
    !noOffers && setShowModal('summary');
  });

  const toggleNoOffer = () => {
    updateMutation.mutate({ auction: { id: auctionId, noOffers: !noOffers }});
  }

  const modalText = `Szkoda, że tym razem się nie udało🥹 Proszę, nie rezygnuj z pomocy 🫶🏼
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
    <Dialog onClose={() => setShowModal('hidden')} open={showModal === 'summary'}>
      <DialogTitle>
        Aukcja zamknięta
        <Button autoFocus onClick={() => navigator.clipboard.writeText(modalText)}>
          Kopiuj tekst
        </Button>
      </DialogTitle>
      <DialogContent>
      Szkoda, że tym razem się nie udało🥹 Proszę, nie rezygnuj z pomocy 🫶🏼<br />
      Możesz wystawić licytacje w grupie TeamLeonaDlaBruna, która również
      wspiera Bruna w walce o terapię genową 💪<br />
      https://www.facebook.com/groups/licytacjedlaleonasma/?ref=share/<br />
      Może tym razem się uda. Nigdy się nie poddajemy‼️<br />
      Dziękujemy z całego serca ❤💙
      </DialogContent>
    </Dialog>
  </>
}