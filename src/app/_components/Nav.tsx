'use client';

import { Add, List, MoreHoriz } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Box, Drawer, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuList, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFundraising } from "~/utils/useFundraising";
import { Menu } from "./Menu";

export const Nav = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const fundraising = useFundraising();

  return <>
    <Box sx={{ paddingBottom: 50, display: { xs: 'none', md: 'block' } }} role="presentation" onClick={() => setOpen(false)}>
      <MenuList dense>
        { fundraising && <ListItem onClick={() => router.push(`/${fundraising.id}/`)} key='list'>
          <ListItemButton>
            <ListItemIcon>
              <List />
            </ListItemIcon>
            <ListItemText primary="Lista" />
          </ListItemButton>
        </ListItem> }
        { fundraising && <ListItem onClick={() => router.push(`/${fundraising.id}/posts/new`)} key="add">
          <ListItemButton>
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText primary="Dodaj aukcje" />
          </ListItemButton>
        </ListItem> }
        <Menu fundraising={fundraising} />
      </MenuList>
    </Box>
    <Drawer open={open} onClose={() => setOpen(false)} anchor="bottom">
      <Box role="presentation" onClick={() => setOpen(false)}>
        <MenuList>
          <Menu fundraising={fundraising} />
        </MenuList>
      </Box>
    </Drawer>
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: {md: 'none'}, zIndex: 10 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, value) => {
          if (!fundraising) return;
          setValue(value);
          if(value === "list") router.push(`/${fundraising.id}`);
          else if(value === "add") router.push(`/${fundraising.id}/posts/new`);
          else if(value === "menu") setOpen(true);
        }}
      >
        <BottomNavigationAction label="Lista" value="list" icon={<List />} />
        <BottomNavigationAction label="Dodaj aukcje" value="add" icon={<Add />}  />
        <BottomNavigationAction label="Więcej" value="menu" icon={<MoreHoriz />} />
      </BottomNavigation>
    </Paper>
  </>
};
