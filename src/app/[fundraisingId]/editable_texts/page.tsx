"use client";

import { Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { KeyboardBackspace } from "@mui/icons-material";
import Link from "next/link";
import { useState } from "react";
import { api } from "~/trpc/react";
import { AddTextDialog } from "./AddTextDialog";
import { CopyableText } from "./CopyableText";
import { Text, TextType } from "~/models/Text";

interface Props {
  params: {
    fundraisingId: string;
  };
}

export default function EditableTextsList({ params: { fundraisingId }}: Props) {
  const { data: texts, isLoading, isError, refetch } = api.texts.list.useQuery({ fundraisingId });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedText, setSelectedText] = useState<Text | undefined>();
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [textToRemove, setTextToRemove] = useState<Text | undefined>();
  const deleteMutation = api.texts.delete.useMutation();

  const handleEdit = (text: Text) => {
    setSelectedText(text);
    setOpenEditDialog(true);
  };

  const handleRemove = (text: Text) => {
    setTextToRemove(text);
    setOpenRemoveDialog(true);
  };

  const confirmRemove = async () => {
    if (textToRemove) {
      await deleteMutation.mutateAsync({ id: textToRemove.id, fundraisingId });
      setOpenRemoveDialog(false);
      setTextToRemove(undefined);
      refetch();
    }
  };

  const handleCloseDialog = () => {
    setSelectedText(undefined);
    setOpenEditDialog(false);
    refetch(); // Refresh the list after editing
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading texts. Please try again later.</p>;
  }

  return (
    <main role="main">
      <h1>
        <Link href={`/${fundraisingId}/`}>
          <IconButton>
            <KeyboardBackspace />
          </IconButton>
        </Link>
        Formułki
        <Button
          autoFocus
          variant="contained"
          sx={{ ml: 2 }}
          onClick={() => setOpenEditDialog(true)}
        >
          Dodaj nowy tekst
        </Button>
      </h1>

      {texts.map((text) => (
        <div key={text.id} style={{ marginBottom: "16px" }}>
          <CopyableText text={text.text} type={text.type} onEdit={() => handleEdit(text)} onRemove={() => handleRemove(text)} />
        </div>
      ))}

      {openEditDialog && (
        <AddTextDialog
          openAddDialog={openEditDialog}
          setOpenAddDialog={setOpenEditDialog}
          selectedText={selectedText}
          closeDialog={handleCloseDialog}
        />
      )}

      <Dialog open={openRemoveDialog} onClose={() => setOpenRemoveDialog(false)}>
        <DialogTitle>Potwierdź usunięcie</DialogTitle>
        <DialogContent>
          Czy na pewno chcesz usunąć ten tekst?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRemoveDialog(false)}>Anuluj</Button>
          <Button color="error" onClick={confirmRemove} disabled={deleteMutation.isLoading}>
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};