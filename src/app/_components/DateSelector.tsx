'use client';

import { FormControl, InputLabel, MenuItem, SelectChangeEvent } from "@mui/material"
import { Select } from "@mui/material"
import dayjs from "dayjs";
import { useState } from "react";
import { useAuctionMutation } from "~/utils/useAuctionMutation";

export const DateSelector = ({ date, auctionId }: { date: Date, auctionId: string }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs(date));
  const updateMutation = useAuctionMutation();

  const handleChange = (e: SelectChangeEvent<string>) => {
    updateMutation.mutate({ auction: { id: auctionId, endsAt: e.target.value }})
    setSelectedDate(dayjs(e.target.value));
  }
  const today = dayjs();

  const days = {
    [selectedDate.toISOString()]: selectedDate.format('ddd, DD.MM')
  };

  [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7].forEach((offset) => {
    days[today.add(offset, 'days').toISOString()] = today.add(offset, 'days').format('ddd, DD.MM');
  });

  return <FormControl sx={{ m: 1, minWidth: 120, margin: 0 }} size="small">
      <InputLabel id="select-date-label" sx={{ zIndex: 1 }}>Data zakończenia</InputLabel>
      <Select<string>
      value={selectedDate.toISOString()}
      label="Data"
      onChange={handleChange}
    >
      {Object.keys(days).sort().map((day =>
        <MenuItem value={day} key={day}>{ (dayjs(day)).format('ddd, DD.MM') }</MenuItem>
      ))}
    </Select>
  </FormControl>
}