"use client";

import { WorkOff, WorkHistory, Delete } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Tooltip } from "@mui/material";
import { useAuctionMutation } from "~/utils/useAuctionMutation";
import useCopyDialog from "~/app/useCopyDialog";
import { useState } from "react";
import { text } from "stream/consumers";

interface Props {
  auctionId: string;
  archived: boolean;
}

export const ArchivedModal = ({ auctionId, archived }: Props) => {
  const [open, setOpen] = useState(false);
  const updateMutation = useAuctionMutation(() => {
    setOpen(false);
  });

  const toggleArchived = () => {
    updateMutation.mutate({ auction: { id: auctionId, archived: !archived } });
  };

  const handleArchiveButton = () => {
    console.log('open');
    setOpen(true);
  }

  return (
    <>
      <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
        Bez ofert:{" "}
      </Box>
      { archived ?
        <Tooltip title="Usunięte">
          <IconButton size="small" color="error" onClick={handleArchiveButton}><Delete /></IconButton>
        </Tooltip>
        :
        <Tooltip title="Usuń">
          <IconButton size="small" color="error" sx={{ opacity: 0.5 }} onClick={handleArchiveButton}><Delete /></IconButton>
        </Tooltip>
      }
      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>
          { archived ? 'Przywrócić aukcję?' : 'Zarchiwizować aukcję?'}
        </DialogTitle>
        <DialogContent>
          { archived ?
            'Aukcja zostanie przywrócona na główną listę' :
            'Aukcja zostanie zarchiwizowana, ale nadal będzie dostępna'
          }
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => setOpen(false)}>Anuluj</Button>
          <Button color="error" onClick={toggleArchived}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
