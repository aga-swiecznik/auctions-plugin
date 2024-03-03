'use client';

import { Auction } from "~/models/Auction";
import { AuctionDetails } from "./Auction";
import { Box, Button, Drawer, Grid, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuList, TextField } from "@mui/material";
import { useState } from "react";
import { AuctionType } from "~/models/AuctionType";
import { FilterAlt, Logout, Person, PunchClock, SpeakerNotes } from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import { FormControl } from "@mui/material";
import { Status } from "~/utils/mapStatusToLabel";
import { TypeFilter } from "./filters/TypeFilter";
import { StatusFilter } from "./filters/StatusFilter";
import { DateFilter } from "./filters/DateFilter";
import { FbUserOption, UserSelectFilter } from "~/app/_components/UserSelectFilter";

export const AuctionList = ({ auctions, groupId }: { auctions: Auction[], groupId: string }) => {
  const [auctionType, setAuctionType] = useState<AuctionType | undefined>();
  const [selectedDate, setSelectedDate] = useState<Dayjs>();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [status, setStatus] = useState<Status | ''>('');
  const [search, setSearch] = useState<string>('');
  const [author, setAuthor] = useState<FbUserOption | null>(null);
  const [winner, setWinner] = useState<FbUserOption | null>(null);

  const today = dayjs();

  const filterAuction = (auction: Auction) => {
    return (
      (!auctionType || auction.type === auctionType) &&
      (!selectedDate || selectedDate.isSame(auction.endsAt, 'day')) &&
      (!status
        || (status === 'to-end' && new Date() > auction.endsAt && !auction.noOffers && !((auction.winnerAmount ?? 0) > 0))
        || (status === 'ended' && (auction.noOffers || (auction.winnerAmount ?? 0) > 0))
        || (status === 'no-offers' && auction.noOffers)
        || (status === 'paid' && auction.paid)
        || (status === 'not-paid' && !auction.paid && (auction.winnerAmount ?? 0) > 0)
        || (status === 'to-delete' && auction.paid && today.diff(auction.endsAt, "day") > 14)
        || (status === 'archived')
      ) &&
      (status === 'archived' ? auction.archived : auction.archived === false) &&
      (!search || auction.name.toLowerCase().includes(search.toLowerCase())) &&
      (!author || auction.author.id === author.id) &&
      (!winner || auction.winner?.id === winner.id)
    )
  }

  return <>
    <Grid container mb={2} direction="row">
      <Grid item xs={6} sm={6} md={4}>
        <DateFilter selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </Grid>
      <Grid item xs={5} sm={6} md={4} pr={1}>
        <StatusFilter status={status} setStatus={setStatus} />
      </Grid>
      <Grid item xs={1} sx={{ display: { xs: 'block', sm: 'none' }, pt: 1 }}>
        <IconButton onClick={() => setOpenDrawer(true)} sx={{ pl: 0 }}><FilterAlt /></IconButton>
      </Grid>
      <Grid item sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'end'}} md={4}>
        <TypeFilter auctionType={auctionType} setAuctionType={setAuctionType} />
      </Grid>
      <Grid item sx={{ display: { xs: 'none', md: 'block' }}} md={4}>
        <FormControl variant="standard" sx={{ width: '100%', pr: 1 }}>
          <TextField
            label="Szukaj"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="standard"
          />
        </FormControl>
      </Grid>
      <Grid item sx={{ display: { xs: 'none', md: 'block' }}} md={4}>
        <FormControl variant="standard" sx={{ width: '100%', pr: 1 }}>
          <UserSelectFilter value={author} setValue={setAuthor} label="Darczyńca" />
        </FormControl>
      </Grid>
      <Grid item sx={{ display: { xs: 'none', md: 'block' }}} md={4}>
        <FormControl variant="standard" sx={{ width: '100%', pr: 1 }}>
          <UserSelectFilter value={winner} setValue={setWinner} label="Licytujący" />
        </FormControl>
      </Grid>
    </Grid>
    <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} anchor="right" sx={{ width: '80%' }}>
      <Box role="presentation" sx={{ p: 2, width: '80vw' }}>
        <h2>Dodatkowe filtry</h2>
        <FormControl variant="standard" sx={{ width: '100%', mb: 2 }}>
          <TextField
            label="Szukaj"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="standard"
          />
        </FormControl>

        <TypeFilter auctionType={auctionType} setAuctionType={setAuctionType} />

        <FormControl variant="standard" sx={{ width: '100%', pr: 1, mb: 2 }}>
          <UserSelectFilter value={author} setValue={setAuthor} label="Darczyńca" />
        </FormControl>

        <FormControl variant="standard" sx={{ width: '100%', pr: 1 }}>
          <UserSelectFilter value={winner} setValue={setWinner} label="Licytujący" />
        </FormControl>
        <Button color="primary" variant="contained" sx={{ mt: 2 }} onClick={() => setOpenDrawer(false)}>Zamknij</Button>
      </Box>
    </Drawer>
    {auctions
      .filter(filterAuction)
      .map(auction => <AuctionDetails key={auction.id} auction={auction} groupId={groupId} />)}
  </>
}
