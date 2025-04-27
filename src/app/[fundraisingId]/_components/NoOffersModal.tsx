"use client";

import { WorkOff, WorkHistory } from "@mui/icons-material";
import { useAuctionMutation } from "~/utils/useAuctionMutation";
import useCopyDialog from "~/app/useCopyDialog";
import { SmallButton } from "~/app/_components/SmallButton";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";

interface Props {
  auctionId: string;
  noOffers: boolean;
}

export const NoOffersModal = ({ auctionId, noOffers }: Props) => {
  const { setText } = useCopyDialog();
  const { fundraisingId } = useParams<{ fundraisingId: string }>(); 
  const { data } = api.texts.get.useQuery({ fundraisingId, type: "no-offers" });
  const updateMutation = useAuctionMutation(() => {
    !noOffers && setText(modalText);
  });

  const toggleNoOffer = () => {
    updateMutation.mutate({ auction: { id: auctionId, noOffers: true }, fundraisingId });
  };

  const toggleOff = () => {
    updateMutation.mutate({ auction: { id: auctionId, noOffers: false }, fundraisingId });
  };

  const modalText = data?.text || "Nie podano tekstu do skopiowania";

  if (!noOffers) {
    return (
      <SmallButton onClick={toggleNoOffer} color="warning" icon={<WorkHistory />} label="bez ofert?" />
    );
  }

  return (
    <SmallButton onClick={toggleOff} color="error" icon={<WorkOff sx={{mr: {lg: 3}}} />} label=" bez ofert" />
  );
};
