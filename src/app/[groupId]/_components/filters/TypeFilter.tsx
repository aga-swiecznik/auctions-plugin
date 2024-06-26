import { ToggleButton, ToggleButtonGroup } from "@mui/material"
import { Casino, Gavel, ShoppingCart, ThumbUp } from "@mui/icons-material";
import { AuctionType } from "~/models/AuctionType";

interface Props {
  auctionType: string | null;
  setAuctionType: (type: string | null) => void;
}

export const TypeFilter = ({auctionType, setAuctionType}: Props) => {
  const changeAuctionType = (
    event: React.MouseEvent<HTMLElement>,
    newType: AuctionType | "",
  ) => {
    setAuctionType(newType === "" ? null : newType);
  };

  return <ToggleButtonGroup
    value={auctionType}
    exclusive
    onChange={changeAuctionType}
    aria-label="Typ aukcji"
    size="small"
  >
    <ToggleButton value={AuctionType.auction}>
      <Gavel />
    </ToggleButton>
    <ToggleButton value={AuctionType.bricks}>
      <Casino />
    </ToggleButton>
    <ToggleButton value={AuctionType.buyNow}>
      <ShoppingCart />
    </ToggleButton>
    <ToggleButton value={AuctionType.likes}>
      <ThumbUp />
    </ToggleButton>
  </ToggleButtonGroup>
};
