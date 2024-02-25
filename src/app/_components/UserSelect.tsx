'use client';

import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import { Control, Controller, FieldValues, Path, PathValue, UseFormSetValue } from "react-hook-form";
import { api } from "~/trpc/react";

type FbUserOption = { id?: string, name: string, inputValue?: string };

interface Props<T extends FieldValues> {
  control: Control<T>
  setValue: UseFormSetValue<T>
  name: Path<T>
  label: string
}

export const UserSelect = <T extends FieldValues>({ control, setValue, name, label }: Props<T>) => {
  const {data: users, refetch} = api.fbUsers.list.useQuery();
  const createMutation = api.fbUsers.add.useMutation();
  const filter = createFilterOptions<FbUserOption>();

  return (
    <Controller
      name={name}
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
                setValue(name, user as PathValue<T, Path<T>>);
              }});
            } else if (newValue && newValue.id && newValue.name) {
              setValue(name, { id: newValue.id, name: newValue.name} as PathValue<T, Path<T>>);
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
          getOptionLabel={(user) => user.name ?? ''}
          renderInput={(params) => <TextField {...params} label={label} />}
          isOptionEqualToValue={(option, value) => option.id === value.id}
        />
      )}
    />
  );
};
