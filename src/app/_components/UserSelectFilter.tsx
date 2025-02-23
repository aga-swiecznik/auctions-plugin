'use client';

import { Autocomplete, TextField } from "@mui/material";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";

export type FbUserOption = { id?: string, name: string, inputValue?: string };

interface Props {
  value: string | null;
  setValue: (value: string | null) => void;
  label: string;
}

export const UserSelectFilter = ({ value, setValue, label }: Props) => {
  const { fundraisingId } = useParams<{ fundraisingId: string }>(); 
  const {data: users} = api.fbUsers.list.useQuery({ fundraisingId });

  const selectedUser = (users || []).filter((user) => user.id === value)[0] ?? null;

  return (
    <Autocomplete
      value={selectedUser}
      onChange={(event, value) => setValue(value?.id || null)}
      options={users || []}
      getOptionLabel={(user) => user.name ?? ''}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => <TextField {...params} label={label} variant="standard" />}
    />
  );
};