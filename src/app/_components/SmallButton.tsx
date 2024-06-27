import { PriceCheck } from "@mui/icons-material"
import { Button, Box } from "@mui/material"

interface Props {
    label: string;
    color?: "info" | "error" | "primary" | "success" | "secondary" | "warning";
    onClick?: () => void;
    icon: JSX.Element;
    visibleLabel?: boolean;
}

export const SmallButton = ({label, color, onClick, icon, visibleLabel}: Props) => {
    return <Button size="small" variant="contained" color={color} onClick={onClick} sx={{minWidth: '35px', height: '35px'}} >
    {icon}
    <Box component="span" sx={{ display: { xs: visibleLabel ? 'inline' : 'none', sm: 'inline' } }}>
      {label}
    </Box>
  </Button>
}