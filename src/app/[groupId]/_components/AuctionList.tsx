'use client';

import { Auction } from "~/models/Auction";
import { AuctionDetails } from "./Auction";
import { MenuItem, Select, SelectChangeEvent, Stack, ToggleButtonGroup } from "@mui/material";
import { ToggleButton } from "@mui/material";
import { useState } from "react";
import { AuctionType } from "~/models/AuctionType";
import { Casino, Gavel, ShoppingCart } from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";

export const AuctionList = ({ auctions, groupId }: { auctions: Auction[], groupId: string }) => {
  const [auctionType, setAuctionType] = useState<AuctionType | undefined>();
  const [selectedDate, setSelectedDate] = useState<Dayjs>();

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

  return <>
    <Stack direction="row" sx={{ m: 1 }}>
      <Select<string>
        value={selectedDate?.format('YYYY-MM-DD') ?? ''}
        label="Data"
        onChange={handleChange}
        sx={{ width: '120px'}}
      >
        <MenuItem value=""></MenuItem>
        {Object.keys(days).sort().map((day =>
          <MenuItem value={day} key={day}>{ days[day] }</MenuItem>
        ))}
      </Select>

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
    {auctions
      .filter(auction => ((!auctionType || auction.type === auctionType) && (!selectedDate || selectedDate.isSame(dayjs(auction.endsAt), 'day'))))
      .map(auction => <AuctionDetails key={groupId} auction={auction} groupId={groupId} />)}
  </>
}
