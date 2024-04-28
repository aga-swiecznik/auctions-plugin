"use client";

import { FormControl, TextField } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "throttle-debounce";

export const SearchFilter = ({
  setQuery,
}: {
  setQuery: (name: string, value: string | undefined) => void;
}) => {
  const searchParams = useSearchParams();

  const handleSearch = useMemo(
    () =>
      debounce(500, (search: string | null) => {
        setQuery("search", search || undefined);
      }),
    []
  );

  return (
    <FormControl variant="standard" sx={{ width: "100%", pr: 1 }}>
      <TextField
        label="Szukaj"
        defaultValue={searchParams.get("search")}
        onChange={(e) => handleSearch(e.target.value)}
        variant="standard"
      />
    </FormControl>
  );
};
