import { More, MoreVert } from "@mui/icons-material";
import { Button, Drawer, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { SmallButton } from "~/app/_components/SmallButton";
import { ArchivedModal } from "./ArchiveModal";
import { Auction } from "~/models/Auction";
import { TypeChip } from "~/app/_components/AuctionType";
import useDateDialog from "~/app/useDateDialog";
import dayjs from "dayjs";
import { type } from "os";

interface Props {
  auction: Auction;
}

export const MoreAuctionsMenu = ({ auction }: Props) => {
  const [visibleMenu, setVisibleMenu] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { setIds } = useDateDialog();

  if (isMobile) {
    const handleClick = () => {setVisibleMenu(true)};
    return <>
      <SmallButton label="" icon={<MoreVert />} onClick={handleClick} />
      <Drawer
        anchor="bottom"
        open={visibleMenu}
        onClose={() => setVisibleMenu(false)}
      >
        <Stack direction="row" gap={3} m={3}>
          <ArchivedModal auctionId={auction.id} archived={auction.archived} />
          <TypeChip auctionId={auction.id} type={auction.type} />
          <Button variant="outlined" onClick={() => setIds(auction.id, auction.endsAt)}>{dayjs(auction.endsAt).format('ddd, DD.MM')}</Button>
        </Stack>
      </Drawer>
    </>;
  }

  return <>
    <ArchivedModal auctionId={auction.id} archived={auction.archived} />
    <TypeChip auctionId={auction.id} type={auction.type} />
    <Button variant="outlined" onClick={() => setIds(auction.id, auction.endsAt)}>{dayjs(auction.endsAt).format('ddd, DD.MM')}</Button>
  </>
    
}


