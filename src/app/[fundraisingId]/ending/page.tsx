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
  const { data: filteredAuctions, error } = api.auction.ending.useQuery({
    fundraisingId: params.fundraisingId,
  });

  if (error && error.data?.code === "UNAUTHORIZED") {
    router.push("/api/auth/signin");
  }

  const today = dayjs();

  if (!filteredAuctions) return <></>;

  const text = `💙❤️ Dzisiaj ${today?.format(
    "DD.MM.YYYY"
  )} kończy się ${numberToEmoji(filteredAuctions.length)} aukcji! ❤️💙

${filteredAuctions.map(
  (auction, index) => `${numberToEmoji(index + 1)} ${auction.name}
${auction.link}`
).join(`
`)}

https://www.siepomaga.pl/licytacje-dla-bruno-walczy-z-dmd

#podsumowanie
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
        💙❤️ Dzisiaj {today?.format("DD.MM.YYYY")} kończy się{" "}
        {numberToEmoji(filteredAuctions.length)} aukcji! ❤️💙
        {filteredAuctions.map((auction, index) => (
          <>
            {numberToEmoji(index + 1)}{" "}
            <a href={auction.link} target="_blank">
              {auction.name}
            </a>
            <br />
          </>
        ))}
        https://www.siepomaga.pl/licytacje-dla-bruno-walczy-z-dmd
        #konczysiedzisiaj
      </Paper>
    </main>
  );
}
