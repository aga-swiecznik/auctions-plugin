"use client";

import { Card, CardContent, Typography } from "@mui/material";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function Home() {
console.log("HOME")

  const { data: fundraisings, error } = api.fundraisings.list.useQuery();
  

  return (
    <main>
      <h1>Lista grup licytacyjnych</h1>
      { fundraisings?.map(fundraising => 
        <Link href={`/${fundraising.id}`} key={`/${fundraising.id}`}>
          <Card>
            <CardContent sx={{mb:0, pb: 2}}>
              <Typography variant="h2" sx={{mb:0}}>{fundraising.name.toUpperCase()}</Typography>
            </CardContent>
            <div></div>
          </Card>
        </Link>
      )}
    </main>
  );
}
