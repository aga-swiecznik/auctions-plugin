"use client";

import { Auction } from "~/models/Auction";
import { AuctionDetails } from "./Auction";
import {
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  Pagination,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { FilterAlt } from "@mui/icons-material";
import { FormControl } from "@mui/material";
import { TypeFilter } from "./filters/TypeFilter";
import { StatusFilter } from "./filters/StatusFilter";
import { DateFilter } from "./filters/DateFilter";
import { UserSelectFilter } from "~/app/_components/UserSelectFilter";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { debounce } from "throttle-debounce";
import { SearchFilter } from "./filters/SearchFilter";

export const AuctionList = ({
  auctions,
  groupId,
  pages,
  dates,
}: {
  auctions: Auction[];
  groupId: string;
  pages: number;
  dates: { [k: string]: string };
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const setQuery = (name: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (name !== "page") {
      params.delete("page");
    }

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.push(pathname + "?" + params.toString());
  };

  const auctionType = searchParams.get("type");
  const selectedDate = searchParams.get("selectedDate");
  const status = searchParams.get("status");
  const author = searchParams.get("author");
  const pageUrl = searchParams.get("page");

  let page = 1;
  if (pageUrl && Number.isInteger(Number.parseInt(pageUrl))) {
    page = Number.parseInt(pageUrl);
  }

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
        <Grid item sx={{ display: { xs: "none", sm: "block" } }} sm={4}>
          <FormControl variant="standard" sx={{ width: "100%", pr: 1 }}>
            <UserSelectFilter
              value={author}
              setValue={(user) => setQuery("author", user || undefined)}
              label="Darczyńca"
            />
          </FormControl>
        </Grid>
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
      {auctions.map((auction) => (
        <AuctionDetails key={auction.id} auction={auction} groupId={groupId} />
      ))}
      <Pagination
        count={pages}
        page={page}
        onChange={(e, page) => setQuery("page", `${page}`)}
      />
    </>
  );
};
