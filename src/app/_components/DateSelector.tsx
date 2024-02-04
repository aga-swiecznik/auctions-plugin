'use client';

import { FormControl, InputLabel, MenuItem, SelectChangeEvent } from "@mui/material"
import { Select } from "@mui/material"
import dayjs from "dayjs";
import { useState } from "react";

export const DateSelector = ({ date }: { date: Date }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs(date));
  const handleChange = (e: SelectChangeEvent<string>) => {
    setSelectedDate(dayjs(e.target.value));
  }
  const today = dayjs();

  const days = {
    [selectedDate.toISOString()]: selectedDate.format('ddd, DD.MM')
  };

  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((offset) => {
    days[today.add(offset, 'days').toISOString()] = today.add(offset, 'days').format('ddd, DD.MM');
  });

  return <FormControl sx={{ m: 1, minWidth: 120, margin: 0 }} size="small">
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