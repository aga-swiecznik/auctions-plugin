"use client";

import { WorkOff, WorkHistory } from "@mui/icons-material";
import { useAuctionMutation } from "~/utils/useAuctionMutation";
import useCopyDialog from "~/app/useCopyDialog";
import { SmallButton } from "~/app/_components/SmallButton";

interface Props {
  auctionId: string;
  noOffers: boolean;
  noOffersYet: boolean;
}

export const NoOffersModal = ({ auctionId, noOffers, noOffersYet }: Props) => {
  const { setText } = useCopyDialog();
  const updateMutation = useAuctionMutation(() => {
    !noOffers && setText(modalText);
  });

  const toggleNoOffer = () => {
    updateMutation.mutate({ auction: { id: auctionId, noOffers: true } });
  };

  const toggleOff = () => {
    updateMutation.mutate({ auction: { id: auctionId, noOffers: false } });
  };

  const modalText = `Szkoda, że tym razem się nie udało 🥹 Proszę, nie rezygnuj z pomocy 🫶🏼 Może spróbujesz wystawić swoją ofertę w wątku Kup Teraz?
  https://www.facebook.com/groups/325336195551284/permalink/926791632072401/
  Może tym razem się uda. Nigdy się nie poddajemy‼️
  Dziękujemy z całego serca ❤💙
  Uwaga! Post będzie usunięty przez administrację 3 dni po zakończeniu aukcji.`;

  if (!noOffers) {
    return (
      <SmallButton onClick={toggleNoOffer} color="warning" icon={<WorkHistory />} label="bez ofert?" />
    );
  }

  return (
    <SmallButton onClick={toggleOff} color="error" icon={<WorkOff sx={{mr: {lg: 3}}} />} label=" bez ofert" />
  );
};
