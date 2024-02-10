'use client';

import { Auction } from "~/models/Auction";
import { AuctionDetails } from "./Auction";
import { Checkbox, Grid, Input, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack, TextField, ToggleButtonGroup } from "@mui/material";
import { ToggleButton } from "@mui/material";
import { useState } from "react";
import { AuctionType } from "~/models/AuctionType";
import { Casino, Gavel, ShoppingCart } from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import { ListItemText } from "@mui/material";
import { FormControl } from "@mui/material";
import { Status, mapStatusToLabel, stringToStatusArray } from "~/utils/mapStatusToLabel";

export const AuctionList = ({ auctions, groupId }: { auctions: Auction[], groupId: string }) => {
  const [auctionType, setAuctionType] = useState<AuctionType | undefined>();
  const [selectedDate, setSelectedDate] = useState<Dayjs>();
  const [status, setStatus] = useState<Status[]>([]);
  const [search, setSearch] = useState<string>('');

  const handleChange = (e: SelectChangeEvent<string>) => {
    setSelectedDate(e.target.value ? dayjs(e.target.value) : undefined);
  }
  const today = dayjs();

  const days: {[key: string]: string} = {};
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((offset) => {
    const day = today.add(offset, 'days');
    days[day.format('YYYY-MM-DD')] = day.format('ddd, DD.MM');
  });

  const changeAuctionType = (
    event: React.MouseEvent<HTMLElement>,
    newType: AuctionType | "",
  ) => {
    setAuctionType(newType === "" ? undefined : newType);
  };

  const handleStatusChange = (event: SelectChangeEvent<Status[]>) => {
    const {
      target: { value },
    } = event;
    setStatus(
      typeof value === 'string' ? stringToStatusArray(value) : value,
    );
  };

  return <>
    <Grid container>
      <Grid item xs={12} sm={6} order={{xs: 1, sm: 2}}>
        <Stack direction="row" sx={{ m: 1 }} gap={1} justifyContent="space-between">
          <FormControl variant="standard" sx={{ minWidth: '50%' }}>
            <InputLabel id="select-date-label" sx={{ zIndex: 1 }}>Data zakończenia</InputLabel>
            <Select<string>
              value={selectedDate?.format('YYYY-MM-DD') ?? ''}
              label="Data"
              onChange={handleChange}
              variant="standard"
            >
              <MenuItem value=""></MenuItem>
              {Object.keys(days).sort().map((day =>
                <MenuItem value={day} key={day}>{ days[day] }</MenuItem>
              ))}
            </Select>
          </FormControl>

          <ToggleButtonGroup
            value={auctionType}
            exclusive
            onChange={changeAuctionType}
            aria-label="Typ aukcji"
            size="small"
          >
            <ToggleButton value={AuctionType.auction}>
              <Gavel />
            </ToggleButton>
            <ToggleButton value={AuctionType.bricks}>
              <Casino />
            </ToggleButton>
            <ToggleButton value={AuctionType.buyNow}>
              <ShoppingCart />
            </ToggleButton>
          </ToggleButtonGroup>

        </Stack>
      </Grid>

      <Grid item xs={12} sm={6} order={{xs: 2, sm: 1}}>
        <Stack direction="row" sx={{ m: 1 }} gap={1}>
          <TextField
            label="Szukaj"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="standard"
            sx={{ width: '50%'}}
          />

          <FormControl variant="standard" sx={{ width: '50%' }}>
            <InputLabel id="select-status-label" sx={{ zIndex: 1 }}>Status</InputLabel>
            <Select<Status[]>
              id="select-status"
              labelId="select-status-label"
              multiple
              value={status}
              variant="standard"
              onChange={handleStatusChange}
              renderValue={() => status.map(s => mapStatusToLabel(s)).join(', ')}
              label="Status"
            >
              <MenuItem value="paid">
                <Checkbox checked={status.includes("paid")} />
                <ListItemText primary={mapStatusToLabel('paid')} />
              </MenuItem>
              {/* <MenuItem value="commented">
                <Checkbox checked={status.includes("commented")} />
                <ListItemText primary={mapStatusToLabel('commented')} />
              </MenuItem> */}
              <MenuItem value="not-paid">
                <Checkbox checked={status.includes("not-paid")} />
                <ListItemText primary={mapStatusToLabel('not-paid')} />
              </MenuItem>
              <MenuItem value="ended">
                <Checkbox checked={status.includes("ended")} />
                <ListItemText primary={mapStatusToLabel('ended')} />
              </MenuItem>
              <MenuItem value="no-offers">
                <Checkbox checked={status.includes("no-offers")} />
                <ListItemText primary={mapStatusToLabel('no-offers')} />
              </MenuItem>
              <MenuItem value="not-collected">
                <Checkbox checked={status.includes("not-collected")} />
                <ListItemText primary={mapStatusToLabel('not-collected')} />
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Grid>
    </Grid>
    {auctions
      .filter(auction => (
        (!auctionType || auction.type === auctionType) &&
        (!selectedDate || selectedDate.isSame(auction.endsAt, 'day')) &&
        (!status.length
          || status.includes('ended') && new Date() > auction.endsAt
          || status.includes('no-offers') && !auction.winnerAmount && new Date() > auction.endsAt
          || status.includes('not-collected') && auction.winnerAmount && !auction.collected
          || status.includes('paid') && auction.paid
          || status.includes('not-paid') && !auction.paid && auction.winnerAmount) &&
        (!search || auction.name.toLowerCase().includes(search.toLowerCase()))
      ))
      .map(auction => <AuctionDetails key={auction.id} auction={auction} groupId={groupId} />)}
  </>
}
