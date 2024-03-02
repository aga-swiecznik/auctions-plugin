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
  const [selectedDate, setSelectedDate] = useState<Dayjs>(today);

  const handleChange = (e: SelectChangeEvent<string>) => {
    setSelectedDate(e.target.value ? dayjs(e.target.value) : today);
  }

  const days: {[key: string]: string} = {};
  [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7].forEach((offset) => {
    const day = today.add(offset, 'days');
    days[day.format('YYYY-MM-DD')] = day.format('ddd, DD.MM');
  });

  const filteredAuctions = (auctions || [])
    .filter(auction => (!selectedDate || selectedDate.isSame(auction.endsAt, 'day')));

  const noOffers = filteredAuctions.filter(auction => auction.noOffers).length;
  const ended = filteredAuctions.filter(auction => auction.winnerAmount).length;
  const sum = filteredAuctions.reduce((partial, auction) => partial + (auction.winnerAmount || 0), 0);

  const text = `💙❤️ PODSUMOWANIE z dnia ${selectedDate?.format('DD.MM.YYYY')} ❤️💙

👉 Przyrost na zbiórce u Bruna od wczorajszego podsumowania to 1️⃣5️⃣,9️⃣9️⃣7️⃣zł
#BrunoTeam

DZIĘKUJEMY ❤️💙
👉 Zakończyliśmy dzisiaj ${numberToEmoji(ended)} licytacji na kwotę ${numberToEmoji(sum)}zł👏❤️💙
👉 Niestety ${numberToEmoji(noOffers)} licytacji nie znalazło swojej oferty 🥲
👉 TIK TOK - Tak Nasz Bruno ma swoje konto na Tik Toku. Serdecznie zapraszamy do obserwacji profilu Bruno walczy z DMD ❣️💙

Oto link do TIK TOKA 🔽🔽🔽🔽
https://www.tiktok.com/@bruno.walczy.z.dmd

📢📢📢 Wesprzeć zbiórkę można również poprzez wysyłanie SMS
Na numer: 75365 o treści: 0385138
(koszt smsa 6,15 z VAT) ‼️

⏩️Dobry klik 🔽 https://www.dobryklik.pl/brunowalczyzdmd

Z całego serca bardzo dziękujemy za tak ogromne zaangażowanie❣️💙❣️💙❣️
Dzięki Wam ten silny chłopiec ma szansę na ZDROWIE...🏃‍➡️💪
DZIĘKUJEMY ❤️💙❤️

Oczywiście zapraszamy do zapoznania się z historią Bruna w linku na samym dole, 
no a jeśli posiadasz 1 zł nadwyżki na swoimi koncie to prosimy podziel się tą złotówką z Naszym Bohaterem 😘😘😘
https://www.siepomaga.pl/licytacje-dla-bruno-walczy-z-dmd

#podsumowanie
`;

  return (
    <main>
      <h1>
        <Link href={`/${params.groupId}/`}><IconButton><KeyboardBackspace /></IconButton></Link>
        Podsumowanie
        <Button autoFocus variant="contained" sx={{ml: 2}} onClick={() => navigator.clipboard.writeText(text)}>
          Kopiuj tekst
        </Button>
      </h1>
      <FormControl variant="standard" sx={{ minWidth: '50%' }}>
        <InputLabel id="select-date-label" sx={{ zIndex: 1 }}>Data</InputLabel>
        <Select<string>
          value={selectedDate?.format('YYYY-MM-DD') ?? ''}
          label="Data"
          onChange={handleChange}
          variant="standard"
        >
          <MenuItem value=""></MenuItem>
          {Object.keys(days).sort().map((day =>
            <MenuItem value={day} key={day}>{ days[day] }</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Paper sx={{mt: 2, p: 2}}>
      💙❤️ PODSUMOWANIE z dnia {selectedDate?.format('DD.MM.YYYY')} ❤️💙<br />
      <br />
      👉 Przyrost na zbiórce u Bruna od wczorajszego podsumowania to 1️⃣5️⃣,9️⃣9️⃣7️⃣zł<br />
      #BrunoTeam<br />
      <br />
      DZIĘKUJEMY ❤️💙<br />
      👉 Zakończyliśmy dzisiaj {numberToEmoji(ended)} licytacji na kwotę {numberToEmoji(sum)}zł👏❤️💙<br />
      👉 Niestety {numberToEmoji(noOffers)} licytacji nie znalazło swojej oferty 🥲<br />
      👉 TIK TOK - Tak Nasz Bruno ma swoje konto na Tik Toku. Serdecznie zapraszamy do obserwacji profilu Bruno walczy z DMD ❣️💙<br />
      <br />
      Oto link do TIK TOKA 🔽🔽🔽🔽<br />
      https://www.tiktok.com/@bruno.walczy.z.dmd<br />
      <br />
      📢📢📢 Wesprzeć zbiórkę można również poprzez wysyłanie SMS<br />
      Na numer: 75365 o treści: 0385138<br />
      (koszt smsa 6,15 z VAT) ‼️<br />
      <br />
      ⏩️Dobry klik 🔽 https://www.dobryklik.pl/brunowalczyzdmd<br />
      <br />
      Z całego serca bardzo dziękujemy za tak ogromne zaangażowanie❣️💙❣️💙❣️<br />
      Dzięki Wam ten silny chłopiec ma szansę na ZDROWIE...🏃‍➡️💪<br />
      DZIĘKUJEMY ❤️💙❤️<br />
      <br />
      Oczywiście zapraszamy do zapoznania się z historią Bruna w linku na samym dole, 
      no a jeśli posiadasz 1 zł nadwyżki na swoimi koncie to prosimy podziel się tą złotówką z Naszym Bohaterem 😘😘😘<br />
      https://www.siepomaga.pl/licytacje-dla-bruno-walczy-z-dmd<br />
      <br />
      #podsumowanie
      </Paper>
    </main>
  );
}
