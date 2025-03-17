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

export default function AuctionListView({
  params,
}: {
  params: { fundraisingId: string };
}) {
  const router = useRouter();
  const { data: filteredAuctions, error } = api.auction.active.useQuery({
    fundraisingId: params.fundraisingId,
  });

  if (error && error.data?.code === "UNAUTHORIZED") {
    router.push("/api/auth/signin");
  }

  const today = dayjs();
  const daysUntilSunday = 7 - today.day(); // day() zwraca 0 dla niedzieli, 1 dla poniedziałku itd.
  const endDate = today.add(daysUntilSunday, 'day').format('DD.MM.YYYY');

  if (!filteredAuctions) return <></>;

  const text = `💙❤️ ${endDate} kończy się ${numberToEmoji(filteredAuctions.length)} aukcji! ❤️💙

${filteredAuctions.map(
  (auction, index) => `${numberToEmoji(index + 1)} ${auction.name}
${auction.link}`
).join(`
`)}

https://zrzutka.pl/w7gw48/s/licytacje-dla-kuby

#konczasie
`;

  return (
    <main>
      <h1>
        <Link href={`/${params.fundraisingId}/`}>
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
      💙❤️ {endDate} kończy się {numberToEmoji(filteredAuctions.length)} aukcji! ❤️💙
      <br />
      {filteredAuctions.map((auction, index) => (
          <>
            {numberToEmoji(index + 1)}{" "}
            <a href={auction.link} target="_blank">
              {auction.name}
            </a>
            <br />
          </>
        ))}
      </Paper>
    </main>
  );
}
