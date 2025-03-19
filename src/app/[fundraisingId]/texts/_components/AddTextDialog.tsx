'use client';

import { Dialog, DialogTitle, Button, DialogContent, Stack, TextField } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
  openAddDialog: boolean;
  setOpenAddDialog: Dispatch<SetStateAction<boolean>>;
  text?: string;
  type?: string;
}

interface TextForm {
  type?: string;
  text: string;
}

export const AddTextDialog = ({openAddDialog, setOpenAddDialog, text, type}: Props) => {
  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TextForm>({
    mode: "onChange",
    defaultValues: {
      text: text || "",
      type
    }
  });

  const onSubmit = (values: TextForm) => {
    // if (!auction) {
    //   createMutation.mutate(
    //     { auction: { ...values, author: values.author?.id ?? "" }, fundraisingId },
    //     {
    //       onError: (e) => console.log(e),
    //     }
    //   );
    // } else {
    //   updateMutation.mutate({
    //     auction: {
    //       ...values,
    //       author: values.author?.id ?? "",
    //       winner: values.winner?.id,
    //     },
    //     fundraisingId
    //   });
    // }
  };

  return <Dialog onClose={() => setOpenAddDialog(false)} open={openAddDialog}>
  <DialogTitle>
    { text ? 'Edytuj tekst' : 'Dodaj nowy tekst'}
  </DialogTitle>
  <DialogContent>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" gap={2}>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              ref={null}
              id="type"
              label="Typ"
              required
              error={!!errors.type}
              helperText={errors.type?.message}
            />
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
              error={!!errors.type}
              helperText={errors.type?.message}
            />
          )}
        />
      </Stack>
    </form>
  </DialogContent>
</Dialog>
}

