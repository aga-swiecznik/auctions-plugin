"use client";

import { EmojiEvents, Close } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useAuctionMutation } from "~/utils/useAuctionMutation";
import { AuctionDTO } from "~/models/Auction";
import useCopyDialog from "~/app/useCopyDialog";
import { SmallButton } from "~/app/_components/SmallButton";

interface Props {
  auctionId: string;
  winnerAmount?: number | null;
  winner?: AuctionDTO["winner"] | null;
}

type Winner = Pick<AuctionDTO, "winner" | "winnerAmount" | "id">;

export const WinnerModal = ({ auctionId, winnerAmount, winner }: Props) => {
  const [showModal, setShowModal] = useState<"hidden" | "form">("hidden");
  const [amount, setAmount] = useState(winnerAmount);
  const { setText } = useCopyDialog();
  const updateMutation = useAuctionMutation(() =>
    setText(modalText, () => setShowModal("hidden"))
  );

  const showWinnerModal = () => {
    setShowModal("form");
  };

  const onSubmit = (values: Winner) => {
    setAmount(values.winnerAmount);
    updateMutation.mutate({
      auction: {
        id: values.id,
        winnerAmount: values.winnerAmount || null,
        winner: values.winner?.id,
      },
    });
  };

  const modalText = `wygrywa!
Wszystkim bardzo dziękujemy za udział w licytacji, a zwycięzcy serdecznie gratulujemy!
✨ Prosimy o wpłatę ${amount} zł do skarbonki Licytacje dla Bruna:
https://www.siepomaga.pl/licytacje-dla-bruno-walczy-z-dmd
❗Dane wpisane przy wpłacie powinny umożliwiać identyfikację zwycięzcy i licytacji - nie wpłacamy anonimowo i nie ukrywamy kwoty
🌷UWAGA🌷Zwycięzcę prosimy o dodanie w komentarzu potwierdzenia wpłaty ze strony Siepomaga (screen lub link)
Regulaminowy czas na wpłatę to 4️⃣8️⃣ h, lecz jeśli chcesz opłacić później, skontaktuj się z Administracją
⚠️ Brak wpłaty oraz brak wiadomości będzie skutkował ponownym wystawieniem licytacji po 72 h
Z całego serca dziękujemy Wam wszystkim za wsparcie, zaangażowanie i walkę o zdrowie Bruna❣️ Nasza siła jest w tym, że jesteśmy tu razem! Razem możemy naprawdę bardzo dużo ❤️`;

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Winner>({
    mode: "onChange",
    defaultValues: { winnerAmount, winner, id: auctionId },
  });

  return (
    <>
      <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
        
      </Box>
      <SmallButton 
        onClick={showWinnerModal}
        label={winnerAmount ? ` ${winnerAmount} zł` : ""}
        icon={<EmojiEvents />}
        visibleLabel={true}
      />
      <Dialog
        onClose={() => {
          setShowModal("hidden");
          reset();
        }}
        open={showModal === "form"}
      >
        <DialogTitle>Koniec aukcji</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setShowModal("hidden")}
          sx={{
            position: "absolute",
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
                    value={field.value || ""}
                    type="number"
                    onChange={(event) => field.onChange(+event.target.value)}
                    label="Kwota końcowa"
                    sx={{ mb: 2 }}
                    error={!!errors.winnerAmount}
                    helperText={errors.winnerAmount?.message}
                  />
                )}
              />
              {/* <UserSelect<Winner> control={control} setValue={setValue} label="Wygrany" name="winner" /> */}
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                size="large"
              >
                Zapisz
              </Button>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
