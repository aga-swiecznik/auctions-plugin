'use client'

import { Casino, Gavel, ShoppingCart } from "@mui/icons-material";
import { Avatar, Box, Chip, Dialog, DialogTitle, Drawer, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuctionType } from "~/models/AuctionType";
import { Status } from "~/models/Status";
import { api } from "~/trpc/react";

export const types: Record<AuctionType, {label: string, icon: JSX.Element }> = {
  [AuctionType.auction]: { label: "Aukcja", icon: <Gavel />},
  [AuctionType.bricks]: { label: "Cegiełki", icon: <Casino />},
  [AuctionType.buyNow]: { label: "Kup teraz", icon: <ShoppingCart />}
};

export const TypeChip = ({ type, auctionId }: {type: AuctionType, auctionId: string}) => {
  const [visibleSwitcher, setVisibleSwitcher] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleClick = () => {
    setVisibleSwitcher(true);
  };

  return <>
    { isMobile ? (
      <Drawer
        anchor="bottom"
        open={visibleSwitcher}
        onClose={() => setVisibleSwitcher(false)}
      >
        <Typography variant="h3" sx={{ padding: 2 }}>Wybierz typ postu</Typography>
        <TypeChipSwitcher type={type} auctionId={auctionId} onClose={() => setVisibleSwitcher(false)} />
      </Drawer>
      ) : (
      <Dialog onClose={() => setVisibleSwitcher(false)} open={visibleSwitcher}>
        <DialogTitle>Wybierz nowy status</DialogTitle>
        <TypeChipSwitcher type={type} auctionId={auctionId} onClose={() => setVisibleSwitcher(false)} />
      </Dialog>
    )}
    <Box component="span" onClick={handleClick} sx={{ cursor: 'pointer' }}>
      <TypeChipView type={type} />
    </Box>
  </>;
}

const TypeChipView = ({ type }: { type: AuctionType }) => {
  return <Chip data-variant={type} label={types[type].label} icon={types[type].icon} />;
}

const TypeChipSwitcher = ({ type, auctionId, onClose }: {type: AuctionType, auctionId: string, onClose: () => void}) => {
  const theme = useTheme();
  const router = useRouter();

  // const changeStatus = api.auctions.changeStatus.useMutation({
  //   onSuccess: () => {
  //     router.refresh();
  //     onClose();
  //   },
  // });

  const handleClick = (type: AuctionType) => {
    console.log(type);
    // changeStatus.mutate({ id: auctionId, status: status });
  };


  return <List sx={{ pt: 0 }}>
    { (Object.keys(types) as AuctionType[]).map(t => <ListItem disableGutters key={`${t}-dialog`}>
      <ListItemButton onClick={() => handleClick(t)}>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: theme.palette.types[t] }}>
            {types[t].icon}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={<>
          {types[t].label}
          { type === t ? <Chip label="Aktywny" sx={{ ml: 2 }} /> : null}
        </>} />
      </ListItemButton>
    </ListItem>
    )}
  </List>;
}
