'use client';

import { Autocomplete, TextField } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { api } from "~/trpc/react";

export type FbUserOption = { id?: string, name: string, inputValue?: string };

interface Props {
  value: FbUserOption | null
  setValue: Dispatch<SetStateAction<FbUserOption | null>>;
  label: string;
}

export const UserSelectFilter = ({ value, setValue, label }: Props) => {
  const {data: users} = api.fbUsers.list.useQuery();

  return (
    <Autocomplete<FbUserOption>
      value={value}
      onChange={(event, value) => setValue(value)}
      options={users || []}
      getOptionLabel={(user) => user.name ?? ''}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => <TextField {...params} label={label} variant="standard" />}
    />
  );
};