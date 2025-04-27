'use client';

import { Dialog, DialogTitle, Button, DialogContent, Stack, TextField, DialogActions, Select, MenuItem, FormHelperText } from "@mui/material";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextType } from "~/models/Text";
import { api } from "~/trpc/react";

interface Props {
  openAddDialog: boolean;
  setOpenAddDialog: Dispatch<SetStateAction<boolean>>;
  selectedText?: Text;
  closeDialog: () => void;
}

interface TextForm {
  type: TextType;
  text: string;
}

export const AddTextDialog = ({openAddDialog, setOpenAddDialog, selectedText, closeDialog}: Props) => {
  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TextForm>({
    mode: "onChange",
    defaultValues: {
      text: selectedText?.text || "",
      type: selectedText?.type || 'other',
    }
  });
  const { fundraisingId } = useParams<{fundraisingId: string}>();


  const createMutation = api.texts.add.useMutation({
    onSuccess: (data) => {
      closeDialog();
    }
  });
  const updateMutation = api.texts.edit.useMutation({
    onSuccess: (data) => {
      closeDialog();
    }
  });

  const onSubmit = (values: TextForm) => {
    if (!selectedText) {
      createMutation.mutate(
        { text: values.text, type: values.type, fundraisingId },
        {
          onError: (e) => console.log(e),
        }
      );
    } else {
      updateMutation.mutate({
        text: values.text, type: values.type, fundraisingId, id: selectedText.id
      })
    }
  };

  return <Dialog onClose={closeDialog} open={openAddDialog} fullWidth>
  <DialogTitle>
    { selectedText?.text ? 'Edytuj tekst' : 'Dodaj nowy tekst'}
  </DialogTitle>
  <DialogContent>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" gap={2} sx={{ pt: 2 }}>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (<>
            <Select
            {...field}
            ref={null}
            id="type"
            label="Typ"
            required
            error={!!errors.type}
           >
              <MenuItem value="other">Inny</MenuItem>
              <MenuItem value="winning">Zamykanie</MenuItem> 
              <MenuItem value="no-offers">Bez ofert</MenuItem>
            </Select>
            <FormHelperText>Pamiętaj ze tekst wygrywający i bez ofert moze być tylko jeden. <br />
            Tekst wygrywający powinien zawierać {`{{amount}}`} jeśli ma być wstawiona kwota wygranej licytacji.</FormHelperText>
            </>
          )}
        />
  
        <Controller
          name="text"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              ref={null}
              id="Tekst"
              label="Tekst"
              required
              multiline
              rows={4}
              error={!!errors.type}
              helperText={errors.type?.message}
            />
          )}
        />
      </Stack>
    </form>
  </DialogContent>
  <DialogActions>
    <Button onClick={closeDialog} >
      Anuluj
    </Button>
    <Button
      type="submit"
      variant="contained"
      onClick={handleSubmit(onSubmit)}
    >
      Zapisz
    </Button>
  </DialogActions>
</Dialog>
}

