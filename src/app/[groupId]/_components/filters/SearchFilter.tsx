"use client";

import { FormControl, TextField } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { debounce } from "throttle-debounce";

export const SearchFilter = ({
  setQuery,
}: {
  setQuery: (name: string, value: string | undefined) => void;
}) => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search"));

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const debouncedSetQuery = debounce(500, (search: string | null) => {
    setQuery("search", search || undefined);
  });

  useEffect(() => {
    debouncedSetQuery(search);
  }, [search]);

  return (
    <FormControl variant="standard" sx={{ width: "100%", pr: 1 }}>
      <TextField
        label="Szukaj"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        variant="standard"
      />
    </FormControl>
  );
};
