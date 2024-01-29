'use client';

import { useSession } from "next-auth/react";
import Link from "next/link";

export const Footer = () => {
  const { data: sessionData } = useSession();
  return <>
    <p>
      {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
    </p>
    <Link
      href={sessionData ? "/api/auth/signout" : "/api/auth/signin"}
    >
      {sessionData ? "Sign out" : "Sign in"}
    </Link>
  </>
};
