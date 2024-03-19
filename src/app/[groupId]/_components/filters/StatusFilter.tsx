import { FormControl, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { Dispatch, SetStateAction } from "react";
import { Status, mapStatusToLabel, stringToStatus } from "~/utils/mapStatusToLabel";

interface Props {
  status: string | null;
  setStatus: (status: string | undefined) => void;
}

export const StatusFilter = ({status, setStatus}: Props) => {
  const statuses: Status[] = ['to-end','paid','not-paid','ended','no-offers','to-delete','archived'];
  const handleStatusChange = (event: SelectChangeEvent<Status | ''>) => {
    const {
      target: { value },
    } = event;
    const newStatus = stringToStatus(value);
    if(!newStatus || newStatus === status) {
      setStatus('');
    } else {
      setStatus(newStatus);
    }
  };

  const statusType = status ? stringToStatus(status) : null;

  return <FormControl variant="standard" sx={{ width: '100%' }}>
  <InputLabel id="select-status-label" sx={{ zIndex: 1 }}>Status</InputLabel>
  <Select<Status>
    id="select-status"
    labelId="select-status-label"
    value={statusType ?? ''}
    variant="standard"
    onChange={handleStatusChange}
    renderValue={() => statusType ? mapStatusToLabel(statusType) : ''}
    label="Status"
  >
    <MenuItem value="">
      <ListItemText primary="Wszystkie" />
    </MenuItem>
    {statuses.map(status => (
      <MenuItem value={status} key={status}>
        <ListItemText primary={mapStatusToLabel(status as Status)} />
      </MenuItem>
    ))}
  </Select>
</FormControl>
};
