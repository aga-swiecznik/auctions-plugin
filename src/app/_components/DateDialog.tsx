'use client';

import { Dialog, DialogTitle, Button, DialogContent, SelectChangeEvent, Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import useDateDialog from "../useDateDialog"
import { useAuctionMutation } from "~/utils/useAuctionMutation";
import dayjs from "dayjs";
import { blue } from "@mui/material/colors";

export const DateDialog = () => {
  const { auctionId, date, closeDialog } = useDateDialog();
  const updateMutation = useAuctionMutation();

  const handleChange = (date: string) => {
    updateMutation.mutate({ auction: { id: auctionId, endsAt: date }})
    closeDialog();
  }

  const today = dayjs();

  const days: {[k: string]: string} = {}

  if(date) {
    const datejs = dayjs(date);
    days[datejs.toISOString()] = datejs.format('ddd, DD.MM')
  };

  [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7].forEach((offset) => {
    days[today.add(offset, 'days').toISOString()] = today.add(offset, 'days').format('ddd, DD.MM');
  });

  return <Dialog onClose={closeDialog} open={!!date}>
  <DialogTitle>
    Ustaw datę końcową
  </DialogTitle>
  <DialogContent>
    <List sx={{ pt: 0 }} dense>
      {Object.keys(days).map(day => (
        <ListItem disableGutters key={day}>
          <ListItemButton onClick={() => handleChange(day)}>
            <ListItemText primary={days[day]} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </DialogContent>
</Dialog>
}