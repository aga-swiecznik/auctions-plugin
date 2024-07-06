'use client';

import { Add, Article, List, Logout, MoreHoriz, Person, People, PunchClock, SpeakerNotes, BarChart, SentimentVeryDissatisfied, WorkOff, Person2 } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Box, Drawer, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuList, Paper } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { checkAdmin } from "~/server/utils/checkAdmin";

const Menu =  () => {
  const { data: sessionData } = useSession();
  const router = useRouter() 
  return [
    <ListItem onClick={() => router.push('/325336195551284/summary')}>
      <ListItemButton>
        <ListItemIcon>
          <SpeakerNotes />
        </ListItemIcon>
        <ListItemText primary="Podsumowanie" />
      </ListItemButton>
    </ListItem>,
    <ListItem onClick={() => router.push('/325336195551284/ending')}>
      <ListItemButton>
        <ListItemIcon>
          <PunchClock />
        </ListItemIcon>
        <ListItemText primary="Kończą się dzisiaj" />
      </ListItemButton>
    </ListItem>,
    <ListItem onClick={() => router.push('/325336195551284/texts')}>
      <ListItemButton>
        <ListItemIcon>
          <Article />
        </ListItemIcon>
        <ListItemText primary="Formułki" />
      </ListItemButton>
    </ListItem>,
    <ListItem onClick={() => router.push('/325336195551284/fb-users')}>
    <ListItemButton>
      <ListItemIcon>
        <People />
      </ListItemIcon>
      <ListItemText primary="Darczyńcy" />
    </ListItemButton>
  </ListItem>,
  <ListItem onClick={() => router.push('/325336195551284/stats')}>
    <ListItemButton>
      <ListItemIcon>
        <BarChart />
      </ListItemIcon>
      <ListItemText primary="Statystyki" />
    </ListItemButton>
  </ListItem>,
  <ListItem onClick={() => router.push('/325336195551284/users-not-paid')}>
    <ListItemButton>
      <ListItemIcon>
        <SentimentVeryDissatisfied />
      </ListItemIcon>
      <ListItemText primary="Niepłacący" />
    </ListItemButton>
  </ListItem>,
  sessionData && sessionData.user && checkAdmin(sessionData.user.name) && <ListItem onClick={() => router.push('/325336195551284/users')}>
    <ListItemButton>
      <ListItemIcon>
        <People />
      </ListItemIcon>
      <ListItemText primary="Darczyńcy" />
    </ListItemButton>
  </ListItem>,
  sessionData && sessionData.user && <ListItem onClick={() => router.push('/325336195551284/profile')}>
    <ListItemButton>
      <ListItemIcon>
        <Person2 />
      </ListItemIcon>
      <ListItemText primary="Profil" />
    </ListItemButton>
  </ListItem>,
  sessionData && sessionData.user && checkAdmin(sessionData.user.name) && <ListItem onClick={() => router.push('/325336195551284/users')}>
    <ListItemButton>
      <ListItemIcon>
        <People />
      </ListItemIcon>
      <ListItemText primary="Użytkownicy" />
    </ListItemButton>
  </ListItem>,
  sessionData ?
    <ListItem onClick={() => router.push('/api/auth/signout')} >
      <ListItemButton>
        <ListItemIcon>
          <Logout />
        </ListItemIcon>
        <ListItemText primary="Wyloguj się" />
      </ListItemButton>
    </ListItem>
    : <ListItem onClick={() => router.push('/api/auth/signin')} >
    <ListItemButton>
      <ListItemIcon>
        <Person />
      </ListItemIcon>
      <ListItemText primary="Zaloguj się" />
    </ListItemButton>
  </ListItem>
  ]
}

export const Nav = () => {
  const { data: sessionData } = useSession();
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();

  return <>
    <Box sx={{ paddingBottom: 50, display: { xs: 'none', md: 'block' } }} role="presentation" onClick={() => setOpen(false)}>
      <MenuList dense>
        <ListItem onClick={() => router.push('/325336195551284/')}>
          <ListItemButton>
            <ListItemIcon>
              <List />
            </ListItemIcon>
            <ListItemText primary="Lista" />
          </ListItemButton>
        </ListItem>
        <ListItem onClick={() => router.push('/325336195551284/posts/new')}>
          <ListItemButton>
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText primary="Dodaj aukcje" />
          </ListItemButton>
        </ListItem>
        <Menu />
      </MenuList>
    </Box>
    <Drawer open={open} onClose={() => setOpen(false)} anchor="bottom">
      <Box role="presentation" onClick={() => setOpen(false)}>
        <MenuList>
          <Menu />
        </MenuList>
      </Box>
    </Drawer>
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: {md: 'none'}, zIndex: 10 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, value) => {
          setValue(value);
          if(value === "list") router.push('/325336195551284');
          else if(value === "add") router.push('/325336195551284/posts/new');
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
