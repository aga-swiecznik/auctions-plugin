"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import {
  Button,
  IconButton,
  Paper,
} from "@mui/material";
import { numberToEmoji } from "~/utils/numberToEmoji";
import { KeyboardBackspace } from "@mui/icons-material";
import Link from "next/link";

interface Props {
  params: { fundraisingId: string }
}

export default function AuctionListView({
  params: { fundraisingId },
}: Props) {
  const router = useRouter();
  const { data: filteredAuctions, error } = api.auction.noOffers.useQuery({
    fundraisingId,
  });

  if (error && error.data?.code === "UNAUTHORIZED") {
    router.push("/api/auth/signin");
  }

  const yesterday = dayjs().subtract(1, 'day');

  if (!filteredAuctions) return <></>;

  const text = `💙❤️ Wczoraj ${yesterday?.format(
    "DD.MM.YYYY"
  )} skończyło się ${numberToEmoji(filteredAuctions.length)} aukcji bez ofert 😢 

Może jest tam coś czego potrzebujesz? Napisz do darczyńcy ofertę lub skomentuj post ❤️
Część ofert może być już niedostępna - część darczyńców usuwa na bieżąco licytacje bez ofert.

${filteredAuctions.map(
  (auction, index) => `${numberToEmoji(index + 1)} ${auction.name}
${auction.link}`
).join(`
`)}

https://zrzutka.pl/w7gw48/s/licytacje-dla-kuby

#bezofert #16milionowdobrychserc #brunoteam
`;

  return (
    <main>
      <h1>
        <Link href={`/${fundraisingId}/`}>
          <IconButton>
            <KeyboardBackspace />
          </IconButton>
        </Link>
        Kończące się dzisiaj
        <Button
          autoFocus
          variant="contained"
          sx={{ ml: 2 }}
          onClick={() => navigator.clipboard.writeText(text)}
        >
          Kopiuj tekst
        </Button>
      </h1>

      <Paper sx={{ mt: 2, p: 2 }}>
      💙❤️ Wczoraj {yesterday?.format(
    "DD.MM.YYYY"
  )} skończyło się {numberToEmoji(filteredAuctions.length)} aukcji bez ofert 😢 
<br /><br />
  Może jest tam coś czego potrzebujesz? Napisz do darczyńcy ofertę lub skomentuj post ❤️<br />
  Część ofert może być już niedostępna - część darczyńców usuwa na bieżąco licytacje bez ofert.<br /><br />

        {filteredAuctions.map((auction, index) => (
          <>
            {numberToEmoji(index + 1)}{" "}
            <a href={auction.link} target="_blank">
              {auction.name}
            </a>
            <br />
          </>
        ))}

        https://zrzutka.pl/w7gw48/s/licytacje-dla-kuby
        #bezofert #16milionowdobrychserc #brunoteam
      </Paper>
    </main>
  );
}
