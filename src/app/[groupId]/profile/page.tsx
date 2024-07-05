"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import {
  Button,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";

export default function AuctionListView({
  params,
}: {
  params: { groupId: string };
}) {
  const { data: sessionData } = useSession();

  const updateMutation = api.users.edit.useMutation({
    onSuccess: () => {},
    onError: (errors) => {
      setError("email", {message: "Prawdopodobnie ten email juz istnieje"})
    }
  });
  
  const onSubmit = (user: User) => {
    updateMutation.mutate(user);
  }
  
  const {
    control: control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<User>({
    mode: 'onChange',
    values: { 
      id: sessionData?.user?.id || '', 
      name: sessionData?.user?.name || '', 
      email: sessionData?.user?.email || '', 
      password: '' 
    },
  });
  
  if(!sessionData || !sessionData.user) return null;
  return (
    <main>
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
                disabled
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
    </main>
  );
}
