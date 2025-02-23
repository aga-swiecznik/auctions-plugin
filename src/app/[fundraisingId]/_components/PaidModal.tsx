'use client';

import { PriceCheck, AttachMoney } from "@mui/icons-material";
import { SmallButton } from "~/app/_components/SmallButton";
import useCopyDialog from "~/app/useCopyDialog";
import { useAuctionMutation } from "~/utils/useAuctionMutation";

interface Props {
  auctionId: string;
  paid: boolean;
}

export const PaidModal = ({auctionId, paid} : Props) => {
  const modalText = `dziękujemy za wpłatę ❤️ Prosimy o kontakt z darczyńcą / osobą wystawiającą w celu ustalenia odbioru 😊
Uwaga! Posty są usuwane przez administrację 14 dni po zakończeniu licytacji.`;

  const { setText } = useCopyDialog();
  const updateMutation = useAuctionMutation(() => {
    !paid && setText(modalText);
  });

  const togglePaid = () => {
    updateMutation.mutate({ auction: { id: auctionId, paid: !paid }});
  }

  return <>
    
    {paid ? 
      <SmallButton color="success" onClick={togglePaid} label="opłacone" icon={<PriceCheck />} />
      :
      <SmallButton color="error" onClick={togglePaid} label="nieopłacone" icon={<AttachMoney />} />
    }
  </>
}