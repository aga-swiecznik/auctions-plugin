'use client'

import { Box, Button, Stack, Typography } from "@mui/material";
import { FormContainer, TextFieldElement, SelectElement } from "react-hook-form-mui";
import { Casino, Gavel, ShoppingCart } from "@mui/icons-material";
import dayjs from 'dayjs';
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Auction, EditAuctionDTO } from "~/models/Auction";
import { AuctionType } from "~/models/AuctionType";

export const AuctionForm = ({ auction, id, groupId }: { auction?: Auction, id?: string, groupId: string }) => {
  const router = useRouter();
  const updateMutation = api.auction.update.useMutation({
    onSuccess: () => {
      router.refresh();
    }
  });
  const createMutation = api.auction.create.useMutation({
    onSuccess: () => {
      router.refresh();
    }
  });

  const handleSubmit = (values: Auction) => {
    if (!auction) {
      createMutation.mutate({ auction: values, groupId});
    } else {
      updateMutation.mutate({ auction: values, groupId});
    }
  };

  const endDate = dayjs().add(2, 'days');
  const defaultValues: EditAuctionDTO = {
    id: auction?.id ?? id ?? '',
    name: auction?.name ?? '',
    endsAt: auction?.endsAt ?? endDate.toDate(),
    type: auction?.type ?? AuctionType.auction,
    winnerAmount: auction?.winnerAmount ?? 0
  };

  const today = dayjs();

  const days: {[key: string]: string} = {};

  if (auction?.endsAt) {
    days[dayjs(auction.endsAt).format('YYYY-MM-DD')] = dayjs(auction.endsAt).format('ddd, DD.MM')
  }

  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((offset) => {
    const day = today.add(offset, 'days');
    days[day.format('YYYY-MM-DD')] = dayjs(day).format('ddd, DD.MM');
  });

  return <Box>
      <FormContainer
        defaultValues={defaultValues}
        onSuccess={handleSubmit}
        FormProps={{}}
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
          <Button type="submit" variant="contained" size="large">Zapisz</Button>
        </Stack>
      </FormContainer>
    </Box>
};
