'use client'

import { Done, Grade, Money, QuestionAnswer } from "@mui/icons-material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Avatar, Box, Chip, Dialog, DialogTitle, Drawer, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Status } from "~/models/Status";
import { api } from "~/trpc/react";

export const statuses: Record<Status, {label: string, icon: JSX.Element }> = {
  [Status.new]: {label: "nowa", icon: <Grade />},
  [Status.deleted]: { label: "zakończona", icon: <Done />},
  [Status.withWinner]: { label: "ma zwycięzcę", icon: <EmojiEventsIcon />},
  [Status.paid]: { label: "opłacona", icon: <Money />},
  [Status.notAuction]: { label: "nie aukcja", icon: <QuestionAnswer />}
};

export const StatusChip = ({ status, auctionId }: {status: Status, auctionId: string}) => {
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
        <Typography variant="h3" sx={{ padding: 2 }}>Wybierz nowy status</Typography>
        <StatusChipSwitcher status={status} auctionId={auctionId} onClose={() => setVisibleSwitcher(false)} />
      </Drawer>
      ) : (
      <Dialog onClose={() => setVisibleSwitcher(false)} open={visibleSwitcher}>
        <DialogTitle>Wybierz nowy status</DialogTitle>
        <StatusChipSwitcher status={status} auctionId={auctionId} onClose={() => setVisibleSwitcher(false)} />
      </Dialog>
    )}
    <Box component="span" onClick={handleClick} sx={{ cursor: 'pointer' }}>
      <StatusChipView status={status} />
    </Box>
  </>;
}

const StatusChipView = ({ status }: { status: Status }) => {
  return <Chip data-variant={status} label={statuses[status].label} icon={statuses[status].icon} />;
}

const StatusChipSwitcher = ({ status, auctionId, onClose }: {status: Status, auctionId: string, onClose: () => void}) => {
  const theme = useTheme();
  const router = useRouter();

  // const changeStatus = api.auctions.changeStatus.useMutation({
  //   onSuccess: () => {
  //     router.refresh();
  //     onClose();
  //   },
  // });

  const handleClick = (status: Status) => {
    console.log(status);
    // changeStatus.mutate({ id: auctionId, status: status });
  };


  return <List sx={{ pt: 0 }}>
    { (Object.keys(statuses) as Status[]).map(st => <ListItem disableGutters key={`${st}-dialog`}>
      <ListItemButton onClick={() => handleClick(st)}>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: theme.palette.statuses[st] }}>
            {statuses[st].icon}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={<>
          {statuses[st].label}
          { status === st ? <Chip label="Aktywny" sx={{ ml: 2 }} /> : null}
        </>} />
      </ListItemButton>
    </ListItem>
    )}
  </List>;
}
