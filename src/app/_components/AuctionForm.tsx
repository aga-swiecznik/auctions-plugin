'use client'

import { Button, Stack, Typography } from "@mui/material";
import { FormContainer, TextFieldElement, SelectElement } from "react-hook-form-mui";
import { Casino, Gavel, ShoppingCart } from "@mui/icons-material";
import dayjs from 'dayjs';
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Auction, EditAuctionDTO } from "~/models/Auction";
import { AuctionType } from "~/models/AuctionType";

export const AuctionForm = ({ auction, id }: { auction?: Auction, id?: string }) => {
  // const router = useRouter();
  // const mutation = api.auctions.update.useMutation({
  //   onSuccess: () => {
  //     router.refresh();
  //   }
  // });

  const handleSubmit = (values: Auction) => {
    // mutation.mutate({ auctionId: auction?.id ?? null, auction: {
    //   ...values,
    //   endsAtDate: dayjs(values.endsAtDate).format('DD-MM-YYYY'),
    //   endsAtTime: dayjs(values.endsAtTime).format('HH:mm')
    // }});
    console.log(values);
  };

  const endDate = dayjs().add(2, 'days');
  const defaultValues: EditAuctionDTO = {
    id: auction?.id ?? id ?? '',
    name: auction?.name ?? '',
    endsAt: auction?.endsAt ?? endDate.toISOString(),
    type: auction?.type ?? AuctionType.auction,
    winnerAmount: auction?.winnerAmount ?? 0
  };

  const today = dayjs();

  const days: {[key: string]: boolean} = {};

  if (auction?.endsAt) {
    days[auction.endsAt] = true
  }

  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((offset) => {
    days[today.add(offset, 'days').toISOString()] = true;
  });

  return <FormContainer
      defaultValues={defaultValues}
      onSuccess={handleSubmit}
    >
      <Stack direction="column">
        { id || auction?.id ? null : <TextFieldElement name="id" label="Link" required sx={{ mb: 2 }} />}
        <TextFieldElement name="name" label="Nazwa" required sx={{ mb: 2 }} />
        <SelectElement
          name="endsAt"
          label="Data zakończenia"
          required
          sx={{ mb: 2 }}
          options={Object.keys(days).sort().map((day => ({
            id: day,
            label: dayjs(day).format('ddd, DD.MM')
          })))}
        />
        <SelectElement
          name="type"
          label="Typ"
          required
          sx={{ mb: 2 }}
          options={[
            {
              id: AuctionType.auction,
              label: <Stack direction="row" gap={2}><Gavel />Aukcja</Stack>
            },
            {
              id: AuctionType.bricks,
              label: <Stack direction="row" gap={2}><Casino />Cegiełki</Stack>
            },
            {
              id: AuctionType.buyNow,
              label: <Stack direction="row" gap={2}><ShoppingCart />Kup teraz</Stack>
            },
        ]}
        />
        <TextFieldElement name="winnerAmount" label="Kwota końcowa" type="number" sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" size="large" sx={{maxWidth: '300px'}}>Zapisz</Button>
      </Stack>
    </FormContainer>
};
