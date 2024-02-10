'use client';

import { EmojiEvents, Close } from "@mui/icons-material";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Modal, Stack } from "@mui/material";
import { Tooltip } from "@mui/material";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { Chip } from "@mui/material";

interface Props {
  auctionId: string;
  groupId: string;
  winnerAmount?: number | null;
  winnerName?: string | null;
}

export const WinnerModal = ({auctionId, groupId, winnerAmount, winnerName} : Props) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState<'hidden' | 'form' | 'summary'>('hidden');
  const updateMutation = api.auction.update.useMutation({
    onSuccess: () => {
      router.refresh();
      setShowModal('summary');
    }
  });
  const showWinnerModal = () => {
    setShowModal('form');
  }

  const handleSubmit = (values: Props) => {
    console.log(values);
    updateMutation.mutate({ auction: { ...values, id: values.auctionId }, groupId})
  }
  return <>
    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
      Zakończ aukcję: {" "}
    </Box>
    <Tooltip title="Wylicytowana kwota">
      <Chip icon={<EmojiEvents />} onClick={showWinnerModal} label={ winnerAmount ? `${winnerAmount}zł` : '-' } variant="filled" />
    </Tooltip>
    <Dialog onClose={() => setShowModal('hidden')} open={showModal === 'form'}>
      <DialogTitle>Koniec aukcji</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => setShowModal('hidden')}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Close />
      </IconButton>
      <DialogContent>
        <FormContainer
          defaultValues={{winnerAmount, winnerName, auctionId}}
          onSuccess={handleSubmit}
        >
          <Stack direction="column">
            <TextFieldElement name="winnerAmount" label="Kwota końcowa" type="number" sx={{ mb: 2 }} />
            <TextFieldElement name="winnerName" label="Wygrany" sx={{ mb: 2 }} />
            <Button type="submit" variant="contained" size="large">Zapisz</Button>
          </Stack>
        </FormContainer>
      </DialogContent>
    </Dialog>
    <Dialog onClose={() => setShowModal('hidden')} open={showModal === 'summary'}>
      <DialogTitle>Aukcja zamknięta</DialogTitle>
      Summary
    </Dialog>
  </>
}