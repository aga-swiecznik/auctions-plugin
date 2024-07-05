'use client';

import { Dispatch, SetStateAction } from "react";
import { User } from "@prisma/client";
import { Dialog, DialogTitle, Button, DialogContent, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { api } from "~/trpc/react";

interface Props {
  setUser: Dispatch<SetStateAction<boolean | Omit<User, "password">>>;
  user: boolean | Omit<User, "password">;
}

export const UserDialog = ({user, setUser} : Props) => {
  const utils = api.useUtils();

  const updateMutation = api.users.edit.useMutation({
    onSuccess: () => {
      setUser(false);
      utils.users.invalidate();
    },
    onError: (errors) => {
      setError("email", {message: "Prawdopodobnie ten email juz istnieje"})
    }
  });
  const addMutation = api.users.add.useMutation({
    onSuccess: () => {
      utils.users.invalidate();
      setUser(false);
    },
    onError: (errors) => {
      setError("email", {message: "Prawdopodobnie ten email juz istnieje"})
    }
  });

  const onSubmit = (user: User) => {
    if(user.id) {
      updateMutation.mutate(user);
    } else {
      addMutation.mutate(user);
    }
  }

  const {
    control: control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<User>({
    mode: 'onChange',
    values: user === true || user === false ? { id: '', name: '', email: '', password: '' } : { ...user, password: '' },
  });

  return <>
    {user &&  
      <Dialog onClose={() => setUser(false)} open={!!user}>
      <DialogTitle>
        { user === true ? 'Dodaj nowe konto' : `Edytuj konto ${user.name}`}
      </DialogTitle>
      <DialogContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" gap={2}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                ref={null}
                label="Imię"
                required
                error={!!errors?.name}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                ref={null}
                label="Email"
                required
                error={!!errors?.email}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                ref={null}
                label="Hasło"
                error={!!errors?.password}
              />
            )}
          />

          <Button type="submit" variant="contained" size="large">Zapisz</Button>
        </Stack>
      </form>
      </DialogContent>
    </Dialog>
    }
  </>
}