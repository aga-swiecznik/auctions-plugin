"use client";

import { FilterAlt } from "@mui/icons-material";
import {
  Grid,
  IconButton,
  FormControl,
  Drawer,
  Box,
  Button,
} from "@mui/material";
import { UserSelectFilter } from "~/app/_components/UserSelectFilter";
import { DateFilter } from "./DateFilter";
import { SearchFilter } from "./SearchFilter";
import { StatusFilter } from "./StatusFilter";
import { TypeFilter } from "./TypeFilter";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export const AllFilters = ({
  dates,
  setQuery,
}: {
  dates: { [k: string]: string };
  setQuery: (name: string, value: string | undefined) => void;
}) => {
  const searchParams = useSearchParams();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const auctionType = searchParams.get("type");
  const selectedDate = searchParams.get("selectedDate");
  const status = searchParams.get("status");
  const author = searchParams.get("author");

  return (
    <>
      <Grid container mb={2} direction="row">
        <Grid item xs={6} sm={4}>
          <DateFilter
            selectedDate={selectedDate}
            setSelectedDate={(date) => setQuery("selectedDate", date)}
            days={dates}
          />
        </Grid>
        <Grid item xs={5} sm={4} pr={1}>
          <StatusFilter
            status={status}
            setStatus={(status) => setQuery("status", status)}
          />
        </Grid>
        <Grid item xs={1} sx={{ display: { xs: "block", sm: "none" }, pt: 1 }}>
          <IconButton onClick={() => setOpenDrawer(true)} sx={{ pl: 0 }}>
            <FilterAlt />
          </IconButton>
        </Grid>
        <Grid
          item
          sx={{ display: { xs: "none", sm: "flex" }, justifyContent: "end" }}
          sm={4}
        >
          <TypeFilter
            auctionType={auctionType}
            setAuctionType={(type) => setQuery("type", type || undefined)}
          />
        </Grid>
        <Grid item sx={{ display: { xs: "none", sm: "block" } }} sm={4}>
          <SearchFilter setQuery={setQuery} />
        </Grid>
        {/* <Grid item sx={{ display: { xs: "none", sm: "block" } }} sm={4}>
          <FormControl variant="standard" sx={{ width: "100%", pr: 1 }}>
            <UserSelectFilter
              value={author}
              setValue={(user) => setQuery("author", user || undefined)}
              label="Darczyńca"
            />
          </FormControl>
        </Grid> */}
        {/* <Grid item sx={{ display: { xs: 'none', md: 'block' }}} md={4}>
      <FormControl variant="standard" sx={{ width: '100%', pr: 1 }}>
        <UserSelectFilter value={winner} setValue={setWinner} label="Licytujący" />
      </FormControl>
    </Grid> */}
      </Grid>
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        anchor="right"
        sx={{ width: "80%" }}
      >
        <Box role="presentation" sx={{ p: 2, width: "80vw" }}>
          <h2>Dodatkowe filtry</h2>
          <SearchFilter setQuery={setQuery} />

          <TypeFilter
            auctionType={auctionType}
            setAuctionType={(type) => setQuery("type", type || undefined)}
          />

          <FormControl variant="standard" sx={{ width: "100%", pr: 1, mb: 2 }}>
            <UserSelectFilter
              value={author}
              setValue={(user) => setQuery("author", user || undefined)}
              label="Darczyńca"
            />
          </FormControl>

          {/* <FormControl variant="standard" sx={{ width: '100%', pr: 1 }}>
        <UserSelectFilter value={winner} setValue={setWinner} label="Licytujący" />
      </FormControl> */}
          <Button
            color="primary"
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => setOpenDrawer(false)}
          >
            Zamknij
          </Button>
        </Box>
      </Drawer>
    </>
  );
};
