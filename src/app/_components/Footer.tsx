'use client';

import { Add, Logout, Person, SpeakerNotes } from "@mui/icons-material";
import { Backdrop, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Footer = () => {
  const { data: sessionData } = useSession();
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const actions = [
    // { icon: <SpeakerNotes />, name: 'Podsumowanie' },
    { icon: <Add />, name: 'Dodaj aukcję', action: () => router.push('/325336195551284/posts/new') },
  ];

  if(sessionData) {
    actions.push({ icon: <Logout />, name: 'Wyloguj', action: () => router.push('/api/auth/signout')})
  } else {
    actions.push({ icon: <Person />, name: 'Zaloguj', action: () => router.push('/api/auth/signin')})
  }

  return <>
    <Backdrop open={open} />
    <SpeedDial
      ariaLabel="menu"
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      {actions.map((action) => (
        <SpeedDialAction
          onClick={action.action}
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
        />
      ))}
    </SpeedDial>
  </>
};
