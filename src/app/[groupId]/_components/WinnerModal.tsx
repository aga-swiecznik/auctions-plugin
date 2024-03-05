'use client';

import { EmojiEvents, Close } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Modal, Stack, TextField } from "@mui/material";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import { Chip } from "@mui/material";
import { useAuctionMutation } from "~/utils/useAuctionMutation";
import { UserSelect } from "~/app/_components/UserSelect";
import { AuctionDTO } from "~/models/Auction";

interface Props {
  auctionId: string;
  winnerAmount?: number | null;
  winner?: AuctionDTO["winner"] | null;
}

type Winner = Pick<AuctionDTO, "winner" | "winnerAmount" | "id">

export const WinnerModal = ({auctionId, winnerAmount, winner} : Props) => {
  const [showModal, setShowModal] = useState<'hidden' | 'form' | 'summary'>('hidden');
  const [amount, setAmount] = useState(winnerAmount)
  const updateMutation = useAuctionMutation(() => setShowModal('summary'));

  const showWinnerModal = () => {
    setShowModal('form');
  }

  const onSubmit = (values: Winner) => {
    setAmount(values.winnerAmount);
    updateMutation.mutate({ auction: {...values, winner: values.winner?.id}})
  }

  const modalText = `KONIEC LICYTACJI ❣️❣️❣️ Wygrywa  ❤️😍❤️
  Wszystkim bardzo dziękujemy za udział w licytacji,
  a zwycięzcy serdecznie gratulujemy 🎈
  ✨Prosimy o wpłatę {amount}zł na konto
  https://www.siepomaga.pl/licytacje-dla-bruno-walczy-z-dmd
  ✨Regulaminowy czas na wpłatę to 48h, lecz jeśli chcesz opłacić
  później, to napisz do Nas (brak wpłaty oraz brak wiadomości będzie
  skutkował ponownym wystawieniem licytacji po 72h)
  👉 🌷UWAGA🌷Zwycięzcę prosimy o dodanie potwierdzenia wpłaty poniżej w
  komentarzu (screen lub link) co znacznie ułatwi Nam
  uzgodnienie odbioru towaru ✨
  Z całego serca dziękujemy Wam wszystkim za wsparcie, zaangażowanie
  i walkę o zdrowie Bruna❣️ WIEMY, ŻE Z WAMI TO NAPRAWDĘ SIĘ UDA🎈🎈🎈`;

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Winner>({
    mode: 'onChange',
    defaultValues: {winnerAmount, winner, id: auctionId},
  });

  return <>
    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
      {winnerAmount ? "Zakończono: " : "Zakończ aukcję: "}
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column">
            <Controller
              name="winnerAmount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  ref={null}
                  type="number"
                  onChange={(event) => field.onChange(+event.target.value)}
                  label="Kwota końcowa"
                  sx={{mb: 2}}
                  required
                  error={!!errors.winnerAmount}
                  helperText={errors.winnerAmount?.message}
                />
              )}
            />
            {/* <UserSelect<Winner> control={control} setValue={setValue} label="Wygrany" name="winner" /> */}
            <Button type="submit" variant="contained" sx={{mt: 2}} size="large">Zapisz</Button>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
    <Dialog onClose={() => setShowModal('hidden')} open={showModal === 'summary'}>
      <DialogTitle>
        Aukcja zamknięta
        <Button autoFocus onClick={() => navigator.clipboard.writeText(modalText)}>
          Kopiuj tekst
        </Button>
      </DialogTitle>
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