"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { numberToEmoji } from "~/utils/numberToEmoji";
import { KeyboardBackspace, FileCopy } from "@mui/icons-material";
import Link from "next/link";
import { CopyButton } from "../_components/CopyButton";

interface Props {
  params: { fundraisingId: string },
}

export default function SummaryView({
  params: { fundraisingId }
}: Props) {
  const router = useRouter();
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(today);
  const { data, error } = api.auction.summary.useQuery({
    fundraisingId,
    selectedDate: selectedDate.toDate(),
  });
  const { data: stats } = api.common.summary.useQuery();
  const { data: amounts } = api.common.amounts.useQuery();

  if (error && error.data?.code === "UNAUTHORIZED") {
    router.push("/api/auth/signin");
  }

  const handleChange = (e: SelectChangeEvent<string>) => {
    setSelectedDate(e.target.value ? dayjs(e.target.value) : today);
  };

  const days: { [key: string]: string } = {};
  [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7].forEach((offset) => {
    const day = today.add(offset, "days");
    days[day.format("YYYY-MM-DD")] = day.format("ddd, DD.MM");
  });

  if (!data) return;

  const text = `💙❤️ PODSUMOWANIE z dnia ${selectedDate?.format(
    "DD.MM.YYYY"
  )} ❤️💙

👉 Przyrost na zbiórce u Bruna od wczorajszego podsumowania to ${numberToEmoji(
    stats?.diff || 0
  )}zł
#BrunoTeam!

DZIĘKUJEMY ❤️💙
👉 Zakończyliśmy dzisiaj ${numberToEmoji(
    data.ended + data.noOffers
  )} licytacji na kwotę ${numberToEmoji(data.sum)}zł👏❤️💙
👉 Niestety ${numberToEmoji(
    data.noOffers
  )} licytacji nie znalazło swojej oferty 🥲

✅ Planujesz dzisiaj zakupy w internecie? Zamawiasz jedzenie? Pamiętaj o: 
https://fanimani.pl/brunowalczyzdmd/ Ciebie nic to nie kosztuje, a Bruno dostanie około 1.5% z wartości Twoich zakupów 😍

✅ Pamiętaj o codziennym Dobrym Kliku - każde odsłonięcie zielonego kafelka to 10 gr: 
https://www.dobryklik.pl/brunowalczyzdmd

✅ Dodawaj paragony w aplikacji PanParagon - każdy paragon to dodatkowe 10gr dla Bruna

✅ Link do zbiórki: 
https://www.siepomaga.pl/bruno

✅ Obserwuj profile Bruna: 
👍 https://www.tiktok.com/@bruno.walczy.z.dmd 
👍 https://www.instagram.com/bruno.walczy.z.dmd
👍 https://www.facebook.com/brunowalczyzdmd

💚 Dziękujemy, że jesteś z nami!
#BrunoTeam

#podsumowanie
`;

  const localeNumber = (num: number | undefined) => (num || 0).toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 0,})

  return (
    <main>
      <h1>
        <Link href={`/${fundraisingId}/`}>
          <IconButton>
            <KeyboardBackspace />
          </IconButton>
        </Link>
        Podsumowanie
        <Button
          autoFocus
          variant="contained"
          sx={{ ml: 2 }}
          onClick={() => navigator.clipboard.writeText(text)}
        >
          Kopiuj tekst
        </Button>
      </h1>
      <FormControl variant="standard" sx={{ minWidth: "50%" }}>
        <InputLabel id="select-date-label" sx={{ zIndex: 1 }}>
          Data
        </InputLabel>
        <Select<string>
          value={selectedDate?.format("YYYY-MM-DD") ?? ""}
          label="Data"
          onChange={handleChange}
          variant="standard"
        >
          <MenuItem value=""></MenuItem>
          {Object.keys(days)
            .sort()
            .map((day) => (
              <MenuItem value={day} key={day}>
                {days[day]}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <Paper sx={{ mt: 2, p: 2 }}>
        💙❤️ PODSUMOWANIE z dnia {selectedDate?.format("DD.MM.YYYY")} ❤️💙
        <br />
        <br />
        👉 Przyrost na zbiórce u Bruna od wczorajszego podsumowania to{" "}
        {numberToEmoji(stats?.diff || 0)} zł
        <br />
        #BrunoTeam!
        <br />
        <br />
        DZIĘKUJEMY ❤️💙
        <br />
        👉 Zakończyliśmy dzisiaj {numberToEmoji(
          data.ended + data.noOffers
        )}{" "}
        licytacji na kwotę {numberToEmoji(data.sum)} zł👏❤️💙
        <br />
        👉 Niestety {numberToEmoji(data.noOffers)} licytacji nie znalazło swojej
        oferty 🥲
        <br />
        <br />
        ✅ Planujesz dzisiaj zakupy w internecie? Zamawiasz jedzenie? Pamiętaj
        o: <br />
        https://fanimani.pl/brunowalczyzdmd/ Ciebie nic to nie kosztuje, a Bruno
        dostanie około 1.5% z wartości Twoich zakupów 😍
        <br />
        <br />
        ✅ Pamiętaj o codziennym Dobrym Kliku - każde odsłonięcie zielonego
        kafelka to 10 gr: <br />
        https://www.dobryklik.pl/brunowalczyzdmd
        <br />
        <br />
        ✅ Link do zbiórki: <br />
        https://www.siepomaga.pl/bruno
        <br />
        <br />
        ✅ Obserwuj profile Bruna: <br />
        👍 https://www.tiktok.com/@bruno.walczy.z.dmd <br />
        👍 https://www.instagram.com/bruno.walczy.z.dmd
        <br />
        👍 https://www.facebook.com/brunowalczyzdmd
        <br />
        <br />
        💚 Dziękujemy, że jesteś z nami!
        <br />
        #BrunoTeam
        <br />
        <br />
        #podsumowanie
      </Paper>

      <Paper sx={{ mt: 2, p: 2 }}>
        Liczby do podsumowania: <br />
        Pełna kwota: 
          {localeNumber(amounts?.total)}
          <CopyButton text={localeNumber(amounts?.total)} /><br />
        Zostało: 
          {localeNumber(amounts?.left)}
          <CopyButton text={localeNumber(amounts?.left)} /><br />
        Procent: 
          {amounts?.percent}
          <CopyButton text={localeNumber(amounts?.percent)} /><br />
        Dzisiaj wpadło: 
          {localeNumber(stats?.diff)}
          <CopyButton text={localeNumber(stats?.diff)} /><br />
        Licytacje liczba: 
          {data.ended + data.noOffers}
          <CopyButton text={localeNumber(data.ended + data.noOffers)} /><br />
        Licytacje suma: 
          {localeNumber(data.sum)}
          <CopyButton text={localeNumber(data.sum)} /><br />
      </Paper>
    </main>
  );
}
