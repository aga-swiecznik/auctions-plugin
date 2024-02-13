'use client';

import { EmojiEvents, Close } from "@mui/icons-material";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Modal, Stack } from "@mui/material";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { Chip } from "@mui/material";
import { useAuctionMutation } from "~/utils/useAuctionMutation";

interface Props {
  auctionId: string;
  winnerAmount?: number | null;
  winnerName?: string | null;
}

export const WinnerModal = ({auctionId, winnerAmount, winnerName} : Props) => {
  const [showModal, setShowModal] = useState<'hidden' | 'form' | 'summary'>('hidden');
  const [amount, setAmount] = useState(winnerAmount)
  const updateMutation = useAuctionMutation(() => setShowModal('summary'));

  const showWinnerModal = () => {
    setShowModal('form');
  }

  const handleSubmit = (values: Props) => {
    setAmount(values.winnerAmount);
    updateMutation.mutate({ auction: { ...values, id: values.auctionId }})
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
      <DialogContent>
      KONIEC LICYTACJI ❣️❣️❣️ Wygrywa  ❤️😍❤️<br />
      Wszystkim bardzo dziękujemy za udział w licytacji,
      a zwycięzcy serdecznie gratulujemy 🎈<br />
      ✨Prosimy o wpłatę {amount}zł na konto<br />
      https://www.siepomaga.pl/licytacje-dla-bruno-walczy-z-dmd<br />
      ✨Regulaminowy czas na wpłatę to 48h, lecz jeśli chcesz opłacić
      później, to napisz do Nas (brak wpłaty oraz brak wiadomości będzie
      skutkował ponownym wystawieniem licytacji po 72h)<br />
      👉 🌷UWAGA🌷Zwycięzcę prosimy o dodanie potwierdzenia wpłaty poniżej w
      komentarzu (screen lub link) co znacznie ułatwi Nam
      uzgodnienie odbioru towaru ✨<br />
      Z całego serca dziękujemy Wam wszystkim za wsparcie, zaangażowanie
      i walkę o zdrowie Bruna❣️ WIEMY, ŻE Z WAMI TO NAPRAWDĘ SIĘ UDA🎈🎈🎈
      </DialogContent>
    </Dialog>
  </>
}