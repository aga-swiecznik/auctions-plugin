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
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";

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
  const { fundraisingId } = useParams<{fundraisingId: string}>();
  const { data } = api.texts.get.useQuery({ fundraisingId, type: "winning" });

  const updateMutation = useAuctionMutation(() =>
    setText(modalText.replace("{{amount}}", `${amount}`), () => setShowModal("hidden"))
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
      fundraisingId
    });
  };

  const modalText = data?.text || "Nie podano tekstu do skopiowania";
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
