
'use client';

import { KeyboardBackspace } from "@mui/icons-material";
import { Button, Skeleton, Stack, TextField } from "@mui/material";
import { Box, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { api } from "~/trpc/react";

interface User {
  id: string;
  name: string;
}

export default function AuctionPost({ params }: { params: { id: string } }) {
  const { data: user, isLoading } = api.fbUsers.get.useQuery({ id: params.id });
  const saveMutation = api.fbUsers.save.useMutation({
    onSuccess: () => {
      router.push(`/fb-users`)
    }
  });
  const router = useRouter();

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    mode: 'onChange',
    defaultValues: user || { id: '', name: '' },
    values: user || { id: '', name: '' }
  });

  if (isLoading) {
    return <Box sx={{ width: '100%' }}>
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
    </Box>;
  }

  if(!user) {
    return '';
  }

  const onSubmit = (values: User) => {
    saveMutation.mutate(values);
  };

  return (
    <Box sx={{ m: 1 }}>
      <h1>
        <IconButton onClick={() => router.back()}><KeyboardBackspace /></IconButton>
        {user.name}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" gap={2}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                ref={null}
                id="link"
                label="Darczyńca"
                required
                error={!!errors.name}
              />
            )}
          />


          {/* <UserSelect control={control} setValue={setValue} label="Darczyńca" name="author" /> */}

          <Button type="submit" variant="contained" size="large">Zapisz</Button>
        </Stack>
      </form>
    </Box>
  );
}
