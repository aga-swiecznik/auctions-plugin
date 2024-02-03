'use client';

import { Auction } from "~/models/Auction";
import { AuctionDetails } from "./Auction";
import { Checkbox, Input, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack, TextField, ToggleButtonGroup } from "@mui/material";
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
    console.log(e.target.value);
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

  // TODO nazwa i opłacone/podbite

  return <>
    <Stack direction="row" sx={{ m: 1 }} gap={1} justifyContent="space-between">
      <FormControl variant="standard" sx={{ minWidth: '50%' }}>
        <InputLabel id="select-date-label">Data zakończenia</InputLabel>
        <Select<string>
          value={selectedDate?.format('YYYY-MM-DD') ?? ''}
          label="Data"
          onChange={handleChange}
          sx={{ width: '120px'}}
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

    <Stack direction="row" sx={{ m: 1 }} gap={1}>
      <TextField
        label="Szukaj"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        variant="standard"
        sx={{ width: '50%'}}
      />

      <FormControl variant="standard" sx={{ width: '50%' }}>
        <InputLabel id="select-status-label">Status</InputLabel>
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
          <MenuItem value="commented">
            <Checkbox checked={status.includes("commented")} />
            <ListItemText primary={mapStatusToLabel('commented')} />
          </MenuItem>
          <MenuItem value="no-offers">
            <Checkbox checked={status.includes("no-offers")} />
            <ListItemText primary={mapStatusToLabel('no-offers')} />
          </MenuItem>
        </Select>
      </FormControl>
    </Stack>
    {auctions
      .filter(auction => (
        (!auctionType || auction.type === auctionType) &&
        (!selectedDate || selectedDate.isSame(auction.endsAt, 'day')) &&
        (!search || auction.name.toLowerCase().includes(search.toLowerCase()))
      ))
      .map(auction => <AuctionDetails key={auction.id} auction={auction} groupId={groupId} />)}
  </>
}
