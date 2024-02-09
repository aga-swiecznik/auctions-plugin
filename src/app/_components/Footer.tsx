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
    { icon: <Person />, name: 'Zaloguj' },
    { icon: <Logout />, name: 'Wyloguj' },
    { icon: <SpeakerNotes />, name: 'Podsumowanie' },
    { icon: <Add />, name: 'Dodaj aukcję', action: () => router.push('/abc/posts/new') },
  ];

  return <>
    {/* <p>
      {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
    </p>
    <Link
      href={sessionData ? "/api/auth/signout" : "/api/auth/signin"}
    >
      {sessionData ? "Sign out" : "Sign in"}
    </Link> */}
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
