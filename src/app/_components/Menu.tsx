'use client';

import { SpeakerNotes, PunchClock, Article, People, SentimentVeryDissatisfied, Person2, Logout, Person } from "@mui/icons-material";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { BarChart } from "recharts";
import { FundraisingWithRole } from "~/models/Fundraising";

export const Menu =  ({ fundraising} : { fundraising: FundraisingWithRole | undefined }) => {
    const { data: sessionData } = useSession();
    const router = useRouter();
  
    const list: ReactNode[] = [];
  
    if (fundraising) {
      list.push(
        <ListItem onClick={() => router.push(`/${fundraising.id}/summary`)} key="summary">
          <ListItemButton>
            <ListItemIcon>
              <SpeakerNotes />
            </ListItemIcon>
            <ListItemText primary="Podsumowanie" />
          </ListItemButton>
        </ListItem>,
        <ListItem onClick={() => router.push(`/${fundraising.id}/ending`)} key="ending">
          <ListItemButton>
            <ListItemIcon>
              <PunchClock />
            </ListItemIcon>
            <ListItemText primary="Kończą się dzisiaj" />
          </ListItemButton>
        </ListItem>,
        <ListItem onClick={() => router.push(`/${fundraising.id}/texts`)} key="texts">
          <ListItemButton>
            <ListItemIcon>
              <Article />
            </ListItemIcon>
            <ListItemText primary="Formułki" />
          </ListItemButton>
        </ListItem>,
        <ListItem onClick={() => router.push(`/${fundraising.id}/fb-users`)} key="fbusers2">
          <ListItemButton>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary="Darczyńcy" />
          </ListItemButton>
        </ListItem>,
        <ListItem onClick={() => router.push(`/${fundraising.id}/stats`)} key="stats">
          <ListItemButton>
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>
            <ListItemText primary="Statystyki" />
          </ListItemButton>
        </ListItem>,
        <ListItem onClick={() => router.push(`/${fundraising.id}/users-not-paid`)} key="unpaid">
          <ListItemButton>
            <ListItemIcon>
              <SentimentVeryDissatisfied />
            </ListItemIcon>
            <ListItemText primary="Niepłacący" />
          </ListItemButton>
        </ListItem>,
        fundraising.role === 'admin' && <ListItem onClick={() => router.push(`/${fundraising.id}/users`)} key="fbusers">
          <ListItemButton>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary="Darczyńcy" />
          </ListItemButton>
        </ListItem>,
        fundraising.role === 'admin' && <ListItem onClick={() => router.push(`/${fundraising.id}/users`)} key="users">
          <ListItemButton>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary="Użytkownicy" />
          </ListItemButton>
        </ListItem>,
      )
    }
  
    if (sessionData) {
      list.push(
        sessionData && sessionData.user && <ListItem onClick={() => router.push(`/profile`)} key='profile'>
          <ListItemButton>
            <ListItemIcon>
              <Person2 />
            </ListItemIcon>
            <ListItemText primary="Profil" />
          </ListItemButton>
        </ListItem>,
        <ListItem onClick={() => router.push('/api/auth/signout')} key="logout">
          <ListItemButton>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Wyloguj się" />
          </ListItemButton>
        </ListItem>
      )
    } else {
      list.push([<ListItem onClick={() => router.push('/api/auth/signin')} key="signin">
        <ListItemButton>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary="Zaloguj się" />
        </ListItemButton>
      </ListItem>])
    }
  
    return list;
  }