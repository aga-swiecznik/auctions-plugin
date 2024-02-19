'use client';

import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { AuctionDTO } from "~/models/Auction";
import { api } from "~/trpc/react";

type FbUserOption = { id?: string, name: string, inputValue?: string };

export const UserSelect = ({ control, setValue }: { control: Control<AuctionDTO>, setValue: UseFormSetValue<AuctionDTO> }) => {
  const {data: users, refetch} = api.fbUsers.list.useQuery();
  const createMutation = api.fbUsers.add.useMutation();
  const filter = createFilterOptions<FbUserOption>();

  return (
    <Controller
      name="author"
      control={control}
      render={({ field }) => (
        <Autocomplete<FbUserOption>
          {...field}
          disablePortal
          options={users ?? []}
          onChange={(event, newValue) => {
            if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              createMutation.mutate({ name: newValue.inputValue }, { onSuccess: async (user) => {
                await refetch();
                setValue('author', user);
              }});
            } else if (newValue && newValue.id && newValue.name) {
              setValue('author', { id: newValue.id, name: newValue.name});
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some((option) => inputValue === option.name);
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                name: `Dodaj "${inputValue}"`,
              });
            }

            return filtered;
          }}
          getOptionLabel={(user) => user.name}
          renderInput={(params) => <TextField {...params} label="Osoba" />}
          isOptionEqualToValue={(option, value) => option.id === value.id}
        />
      )}
    />
  );
};
