import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import dayjs from "dayjs";

interface Props {
  selectedDate: string | null;
  setSelectedDate: (date: string | undefined) => void;
  days?: {[key: string]: string};
}

export const DateFilter = ({selectedDate, setSelectedDate, days}: Props) => {
  const handleChange = (e: SelectChangeEvent<string>) => {
    setSelectedDate(e.target.value || undefined);
  }
  const today = dayjs();

  let optionDays: {[key: string]: string};
  if(days) {
    optionDays = days;
  } else {
    optionDays = {};
    [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7].forEach((offset) => {
      const day = today.add(offset, 'days');
      optionDays[day.format('YYYY-MM-DD')] = day.format('ddd, DD.MM');
    });
  }

  return <FormControl variant="standard" sx={{ minWidth: '100%', pr: 1 }}>
    <InputLabel id="select-date-label" sx={{ zIndex: 1 }}>Data zakończenia</InputLabel>
    <Select<string>
      value={selectedDate ?? ''}
      label="Data"
      onChange={handleChange}
      variant="standard"
    >
      <MenuItem value="">Wszystkie</MenuItem>
      {Object.keys(optionDays).sort().map((day =>
        <MenuItem value={day} key={day}>{ optionDays[day] }</MenuItem>
      ))}
    </Select>
  </FormControl>;
}