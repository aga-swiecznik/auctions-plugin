'use client';

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Button, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent } from "@mui/material";
import { numberToEmoji } from "~/utils/numberToEmoji";
import { KeyboardBackspace } from "@mui/icons-material";
import Link from "next/link";

export default function AuctionListView({ params }: { params: { groupId: string } }) {
  const router = useRouter();
  const { data: auctions, error } = api.auction.list.useQuery({ groupId: params.groupId });

  if(error && error.data?.code === 'UNAUTHORIZED') {
    router.push('/api/auth/signin');
  }

  const today = dayjs();

  const filteredAuctions = (auctions || [])
    .filter(auction => (dayjs(auction.endsAt).format('DD.MM.YYYY') === today.format('DD.MM.YYYY')));

  const text = `💙❤️ Dzisiaj ${today?.format('DD.MM.YYYY')} kończy się ${numberToEmoji(filteredAuctions.length)} aukcji! ❤️💙



https://www.siepomaga.pl/licytacje-dla-bruno-walczy-z-dmd

#podsumowanie
`;

  return (
    <main>
      <h1>
        <Link href={`/${params.groupId}/`}><IconButton><KeyboardBackspace /></IconButton></Link>
        Kończące się dzisiaj
        <Button autoFocus variant="contained" sx={{ml: 2}} onClick={() => navigator.clipboard.writeText(text)}>
          Kopiuj tekst
        </Button>
      </h1>

      <Paper sx={{mt: 2, p: 2}}>
      💙❤️ Dzisiaj {today?.format('DD.MM.YYYY')} kończy się {numberToEmoji(filteredAuctions.length)} aukcji! ❤️💙



      https://www.siepomaga.pl/licytacje-dla-bruno-walczy-z-dmd

      #konczysiedzisiaj
      </Paper>
    </main>
  );
}
