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
import { KeyboardBackspace } from "@mui/icons-material";
import Link from "next/link";
import { CopyableText } from "./_components/CopyableText";

export default function AuctionListView({
  params,
}: {
  params: { groupId: string };
}) {
  const fundraiser = `Dzień dobry 🙂
Piszę do Państwa z prośbą o pomoc w zbiórce pieniędzy na najdroższy lek świata dla Bruna z Łodzi, cierpiącego na Dystrofię mięśniową Duchenne'a, którego zdrowie i życie wyceniono na 16 mln złotych 🙁
Może zachcieliby Państwo podarować dowolny produkt z Państwa oferty na licytacje?
Sami nie damy rady zebrać tak wielkiej kwoty 😔 Prosimy o pomoc ❣
Mamy grupę na fb gdzie wystawiamy różne ofiarowane przedmioty ❤️
https://www.facebook.com/groups/325336195551284/?ref=share
Chętnie także pomogę w wystawieniu fantów ☺️
Dochód z licytacji zasili zbiórkę www.siepomaga.pl/bruno
Pozdrawiam i dziękuję ❤️
`;

  const remainder = `Przypominajka ❤️ 💙
Ta licytacja kończy się dziś o godzinie 21⁰⁰.‼️ To ostatnia szansa na wygranie wypatrzonego przedmiotu. 📢‼️
(@... Oznaczamy osoby biorące udział w licytacji)
Jeśli macie ochotę możecie jeszcze powalczyć dla Bruna❤️💙❤️
Dziękujemy ❤️💙`;

  const endAuction = `Wygrywa
Wszystkim bardzo dziękujemy za udział w licytacji, a zwycięzcy serdecznie gratulujemy!
✨ Prosimy o wpłatę X zł do skarbonki:
https://www.siepomaga.pl/licytacje-dla-bruno-walczy-z-dmd
❗Dane wpisane przy wpłacie powinny umożliwiać identyfikację zwycięzcy i licytacji - nie wpłacamy anonimowo i nie ukrywamy kwoty
🌷UWAGA🌷Zwycięzcę prosimy o dodanie w komentarzu potwierdzenia wpłaty ze strony Siepomaga (screen lub link)
Regulaminowy czas na wpłatę to 4️⃣8️⃣ h, lecz jeśli chcesz opłacić później, skontaktuj się z Administracją
⚠️ Brak wpłaty oraz brak wiadomości będzie skutkował ponownym wystawieniem licytacji po 72 h
Z całego serca dziękujemy Wam wszystkim za wsparcie, zaangażowanie i walkę o zdrowie Bruna❣️ Nasza siła jest w tym, że jesteśmy tu razem! Razem możemy naprawdę bardzo dużo ❤️`;

  const moneyRemainder = `Przypominamy o wpłacie na konto zbiórki: www.siepomaga.pl/licytacje-dla-bruno-walczy-z-dmd

  ❗Jeśli wpłata nie wpłynie w ciągu najbliższych 2️⃣4️⃣ godzin, przedmiot trafi do ponownej licytacji❗`;

  const rejectText = `Dziękujemy, że chce Pani wesprzeć Brunka fantami. Niestety obawiamy się, że koszt przesyłki przewyższy wartość licytowanych przedmiotów. Staramy się nie wpuszczać tego typu licytacji, by bardziej wartościowe przedmioty nie umknęły uwadze członków grupy. Będziemy bardzo wdzięczni za udostępnienie informacji o zbiórce dla Bruna i o naszej grupie z licytacjami. Fanty prosimy wstawić w poście Kup teraz-https://m.facebook.com/groups/325336195551284/permalink/926791632072401/?`;

  const auctionSchema = `💎 Opis
💎 Zdjęcie
💎 Cena wywolawcza
💎 Data zakończenia (do 99zł - 2dni, od 100 zł - 5dni)
💎 Godzina zakończenia - 21:00
💎 Informacja o sposobie odbioru (osobisty - skąd, wysyłka - kto pokrywa koszty) LUB
💎 Informacja o miejscu i terminie realizacji usługi
💎 link do zbiórki: https://www.siepomaga.pl/bruno`;

  const noOffers = `Szkoda, że tym razem się nie udało🥹 Proszę, nie rezygnuj z pomocy 🫶🏼 Może spróbujesz wystawić swoją ofertę w wątku Kup Teraz?
https://www.facebook.com/groups/325336195551284/permalink/926791632072401/
Może tym razem się uda. Nigdy się nie poddajemy‼️
Dziękujemy z całego serca ❤💙
Uwaga! Post będzie usunięty przez administrację 3 dni po zakończeniu aukcji.`;

  const notPayedAuction = `‼️Niestety ta licytacja nie została opłacona. 😔 
Prosimy o ponowne wystawienie przedmiotu @`;

  const paymentThankYou = `dziękujemy za wpłatę ❤️ Prosimy o kontakt z darczyńcą / osobą wystawiającą w celu ustalenia odbioru 😊

Uwaga! Posty są usuwane przez administrację 14 dni po zakończeniu licytacji.`;

  return (
    <main>
      <h1>
        <Link href={`/${params.groupId}/`}>
          <IconButton>
            <KeyboardBackspace />
          </IconButton>
        </Link>
        Formułki
      </h1>

      <CopyableText text={fundraiser} title="Prośba o fanty" />
      <CopyableText text={remainder} title="Przypominajka" />
      <CopyableText text={endAuction} title="Koniec licytacji" />
      <CopyableText text={moneyRemainder} title="Przypomnienie o wpłacie" />
      <CopyableText text={rejectText} title="Odrzucenie licytacji" />
      <CopyableText text={noOffers} title="Bez ofert" />
      <CopyableText text={auctionSchema} title="Schemat licytacji" />
      <CopyableText text={notPayedAuction} title="Licytacja nieopłacona" />
      <CopyableText text={paymentThankYou} title="Licytacja nieopłacona" />
    </main>
  );
}
