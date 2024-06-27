"use client";

import { Delete } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Tooltip } from "@mui/material";
import { useAuctionMutation } from "~/utils/useAuctionMutation";
import { useState } from "react";
import { SmallButton } from "~/app/_components/SmallButton";

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
    setOpen(true);
  }

  return (
    <>
      { archived ?
        <SmallButton color="error" onClick={handleArchiveButton} icon={<Delete />} label={"usunięte"} />
        :
        <SmallButton color="error" onClick={handleArchiveButton} icon={<Delete />} label={"usuń"} />
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
