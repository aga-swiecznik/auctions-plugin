'use client';

import { Auction } from "~/models/Auction";
import { AuctionDetails } from "./Auction";
import { Box, Button, Drawer, Grid, IconButton, Pagination, TextField } from "@mui/material";
import { useState } from "react";
import { FilterAlt } from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import { FormControl } from "@mui/material";
import { TypeFilter } from "./filters/TypeFilter";
import { StatusFilter } from "./filters/StatusFilter";
import { DateFilter } from "./filters/DateFilter";
import { UserSelectFilter } from "~/app/_components/UserSelectFilter";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ITEMS_PER_PAGE = 100;

export const AuctionList = ({ auctions, groupId }: { auctions: Auction[], groupId: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const setQuery = (name: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    if(name !== 'page') {
      params.delete('page');
    }

    if(value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.push(pathname + '?' + params.toString())
  }

  const days: {[key: string]: string} = {};
  auctions.forEach((auction) => {
    if(auction.archived) return;
    const day = dayjs(auction.endsAt);
    days[day.format('YYYY-MM-DD')] = day.format('ddd, DD.MM');
  });

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const auctionType = searchParams.get('type');
  const selectedDate = searchParams.get('selectedDate');
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const author = searchParams.get('author');
  const winner = searchParams.get('winner');
  const pageUrl = searchParams.get('page');
  const selectedDayjs = selectedDate ? dayjs(selectedDate) : null;

  let page = 1;
  if(pageUrl && Number.isInteger(Number.parseInt(pageUrl))) {
    page = Number.parseInt(pageUrl);
  }

  const today = dayjs();

  const filterAuction = (auction: Auction) => {
    return (
      (!auctionType || auction.type === auctionType) &&
      (!selectedDayjs || selectedDayjs.isSame(auction.endsAt, 'day')) &&
      (!status
        || (status === 'to-end' && new Date() > auction.endsAt && !auction.noOffers && !((auction.winnerAmount ?? 0) > 0))
        || (status === 'ended' && (auction.noOffers || (auction.winnerAmount ?? 0) > 0))
        || (status === 'no-offers' && auction.noOffers)
        || (status === 'paid' && auction.paid)
        || (status === 'not-paid' && !auction.paid && (auction.winnerAmount ?? 0) > 0)
        || (status === 'overdue' && !auction.paid && (auction.winnerAmount ?? 0) > 0 && today.diff(auction.endsAt, "day") > 3)
        || (status === 'to-delete' &&
             ((auction.paid && today.diff(auction.endsAt, "day") > 14) || (auction.noOffers && today.diff(auction.endsAt, "day") > 3 )))
        || (status === 'archived')
      ) &&
      (status === 'archived' ? auction.archived : auction.archived === false) &&
      (!search || auction.name.toLowerCase().includes(search.toLowerCase())) &&
      (!author || auction.author.id === author) &&
      (!winner || auction.winner?.id === winner)
    )
  }

  const filteredAuctions = auctions.filter(filterAuction);

  return <>
    <Grid container mb={2} direction="row">
      <Grid item xs={6} sm={4}>
        <DateFilter selectedDate={selectedDate} setSelectedDate={(date) => setQuery('selectedDate', date)} days={days} />
      </Grid>
      <Grid item xs={5} sm={4} pr={1}>
        <StatusFilter status={status} setStatus={(status) => setQuery('status', status)} />
      </Grid>
      <Grid item xs={1} sx={{ display: { xs: 'block', sm: 'none' }, pt: 1 }}>
        <IconButton onClick={() => setOpenDrawer(true)} sx={{ pl: 0 }}><FilterAlt /></IconButton>
      </Grid>
      <Grid item sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'end'}} sm={4}>
        <TypeFilter auctionType={auctionType} setAuctionType={(type) => setQuery('type', type || undefined)} />
      </Grid>
      <Grid item sx={{ display: { xs: 'none', sm: 'block' }}} sm={4}>
        <FormControl variant="standard" sx={{ width: '100%', pr: 1 }}>
          <TextField
            label="Szukaj"
            value={search}
            onChange={(e) => setQuery('search', e.target.value)}
            variant="standard"
          />
        </FormControl>
      </Grid>
      <Grid item sx={{ display: { xs: 'none', sm: 'block' }}} sm={4}>
        <FormControl variant="standard" sx={{ width: '100%', pr: 1 }}>
          <UserSelectFilter value={author} setValue={(user) => setQuery('author', user || undefined)} label="Darczyńca" />
        </FormControl>
      </Grid>
      {/* <Grid item sx={{ display: { xs: 'none', md: 'block' }}} md={4}>
        <FormControl variant="standard" sx={{ width: '100%', pr: 1 }}>
          <UserSelectFilter value={winner} setValue={setWinner} label="Licytujący" />
        </FormControl>
      </Grid> */}
    </Grid>
    <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} anchor="right" sx={{ width: '80%' }}>
      <Box role="presentation" sx={{ p: 2, width: '80vw' }}>
        <h2>Dodatkowe filtry</h2>
        <FormControl variant="standard" sx={{ width: '100%', mb: 2 }}>
          <TextField
            label="Szukaj"
            value={search}
            onChange={(e) => setQuery('search', e.target.value)}
            variant="standard"
          />
        </FormControl>

        <TypeFilter auctionType={auctionType} setAuctionType={(type) => setQuery('type', type || undefined)} />

        <FormControl variant="standard" sx={{ width: '100%', pr: 1, mb: 2 }}>
          <UserSelectFilter value={author} setValue={(user) => setQuery('author', user || undefined)} label="Darczyńca" />
        </FormControl>

        {/* <FormControl variant="standard" sx={{ width: '100%', pr: 1 }}>
          <UserSelectFilter value={winner} setValue={setWinner} label="Licytujący" />
        </FormControl> */}
        <Button color="primary" variant="contained" sx={{ mt: 2 }} onClick={() => setOpenDrawer(false)}>Zamknij</Button>
      </Box>
    </Drawer>
    { filteredAuctions
        .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
        .map(auction => <AuctionDetails key={auction.id} auction={auction} groupId={groupId} />)}
    <Pagination count={Math.ceil(filteredAuctions.length / ITEMS_PER_PAGE)} page={page} onChange={(e, page) => setQuery('page', `${page}`)} />
  </>
}
