'use client';

import { Dialog, DialogTitle, Button, DialogContent } from "@mui/material";
import useCopyDialog from "../useCopyDialog"

export const CopyDialog = () => {
  const { text, closeDialog } = useCopyDialog();

  return <Dialog onClose={closeDialog} open={!!text.length}>
  <DialogTitle>
    Aukcja zamknięta
    <Button autoFocus color="primary" variant="contained" onClick={() => navigator.clipboard.writeText(text)}>
      Kopiuj tekst
    </Button>
  </DialogTitle>
  <DialogContent>
    {text}
  </DialogContent>
</Dialog>
}