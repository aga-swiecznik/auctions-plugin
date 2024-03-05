import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { Dispatch, SetStateAction } from "react";

interface Props {
  selectedDate: string | null;
  setSelectedDate: (date: string | undefined) => void;
}

export const DateFilter = ({selectedDate, setSelectedDate}: Props) => {
  const handleChange = (e: SelectChangeEvent<string>) => {
    setSelectedDate(e.target.value || undefined);
  }
  const today = dayjs();

  const days: {[key: string]: string} = {};
  [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7].forEach((offset) => {
    const day = today.add(offset, 'days');
    days[day.format('YYYY-MM-DD')] = day.format('ddd, DD.MM');
  });
  return <FormControl variant="standard" sx={{ minWidth: '100%', pr: 1 }}>
    <InputLabel id="select-date-label" sx={{ zIndex: 1 }}>Data zakończenia</InputLabel>
    <Select<string>
      value={selectedDate ?? ''}
      label="Data"
      onChange={handleChange}
      variant="standard"
    >
      <MenuItem value=""></MenuItem>
      {Object.keys(days).sort().map((day =>
        <MenuItem value={day} key={day}>{ days[day] }</MenuItem>
      ))}
    </Select>
  </FormControl>;
}