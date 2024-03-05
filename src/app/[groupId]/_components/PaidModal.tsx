'use client';

import { PriceCheck, AttachMoney } from "@mui/icons-material";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Modal, Stack } from "@mui/material";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import { useAuctionMutation } from "~/utils/useAuctionMutation";

interface Props {
  auctionId: string;
  paid: boolean;
}

export const PaidModal = ({auctionId, paid} : Props) => {
  const [showModal, setShowModal] = useState<'hidden' | 'summary'>('hidden');
  const updateMutation = useAuctionMutation(() => {
    !paid && setShowModal('summary');
  });

  const togglePaid = () => {
    updateMutation.mutate({ auction: { id: auctionId, paid: !paid }});
  }

  const modalText = `dziękujemy za wpłatę ❤️ Prosimy o kontakt z darczyńcą / osobą wystawiającą w celu ustalenia odbioru 😊

  Uwaga! Posty są usuwane przez administrację 14 dni po zakończeniu licytacji.`;

  return <>
    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
      Opłacone: {" "}
    </Box>
    {paid ? <Tooltip title="Opłacone">
      <IconButton size="small" color="success" onClick={togglePaid}><PriceCheck /></IconButton>
    </Tooltip>
    :
    <Tooltip title="Nieopłacone">
      <IconButton size="small" color="error" onClick={togglePaid}><AttachMoney /></IconButton>
    </Tooltip>
    }
    <Dialog onClose={() => setShowModal('hidden')} open={showModal === 'summary'}>
      <DialogTitle>
        Aukcja zamknięta
        <Button autoFocus onClick={() => navigator.clipboard.writeText(modalText)}>
          Kopiuj tekst
        </Button>
      </DialogTitle>
      <DialogContent>
        dziękujemy za wpłatę ❤️ Prosimy o kontakt z darczyńcą / osobą wystawiającą w celu ustalenia odbioru 😊
        <br /><br />
        Uwaga! Posty są usuwane przez administrację 14 dni po zakończeniu licytacji.
      </DialogContent>
    </Dialog>
  </>
}