'use client';

import { Dialog, DialogTitle, Button, DialogContent } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface Props {
  openAddDialog: boolean;
  setOpenAddDialog: Dispatch<SetStateAction<boolean>>;
  text?: string;
}

export const AddTextDialog = ({openAddDialog, setOpenAddDialog, text}: Props) => {

  return <Dialog onClose={() => setOpenAddDialog(false)} open={openAddDialog}>
  <DialogTitle>
    { text ? 'Edytuj tekst' : 'Dodaj nowy tekst'}
  </DialogTitle>
  <DialogContent>
    {text}
  </DialogContent>
</Dialog>
}