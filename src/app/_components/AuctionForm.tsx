'use client'

import { Box, Button, MenuItem, Select, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Casino, Gavel, ShoppingCart } from "@mui/icons-material";
import dayjs from 'dayjs';
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Auction, AuctionDTO, EditFormAuctionDTO } from "~/models/Auction";
import { AuctionType } from "~/models/AuctionType";
import { useAuctionMutation } from "~/utils/useAuctionMutation";
import { UserSelect } from "./UserSelect";

export const AuctionForm = ({ auction, id, groupId }: { auction?: Auction, id?: string, groupId: string }) => {
  const router = useRouter();
  const updateMutation = useAuctionMutation();
  const createMutation = api.auction.create.useMutation({
    onSuccess: () => {
      router.push(`/${groupId}`)
    },
    onError: (data) => console.log(data)
  });

  const onSubmit = (values: AuctionDTO) => {
    if (!auction) {
      createMutation.mutate({ auction: {...values, author: values.author.id}, groupId}, {
        onError: (e) => console.log(e),
      });
    } else {
      updateMutation.mutate({ auction: {...values, author: values.author.id}});
    }
  };

  const endDate = dayjs().add(2, 'days').format('YYYY-MM-DD');
  const defaultValues = {
    id: id ?? '',
    author: auction?.author ?? {},
    notes: auction?.notes ?? '',
    name: auction?.name ?? '',
    link: auction?.link ?? '',
    endsAt: auction?.endsAt ? dayjs(auction?.endsAt).format('YYYY-MM-DD') : endDate,
    type: auction?.type ?? AuctionType.auction,
    winnerAmount: auction?.winnerAmount ?? 0,
    winnerName: auction?.winnerName ?? ''
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

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AuctionDTO>({
    mode: 'onChange',
    defaultValues: defaultValues,
  });
  console.log(defaultValues.author)

  return <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" gap={2}>
          <Controller
            name="link"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                ref={null}
                id="link"
                label="link"
                required
                error={!!errors.link}
                helperText={errors.link?.message ?? ' '}
              />
            )}
          />
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                ref={null}
                id="name"
                label="Nazwa"
                required
                error={!!errors.name}
                helperText={errors.name?.message ?? ' '}
              />
            )}
          />

          <UserSelect control={control} setValue={setValue} />

          <Controller
            name="endsAt"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                ref={null}
                id="endsAt"
                label="Data zakończenia"
                required
                error={!!errors.endsAt}
              >
                {Object.keys(days).sort().map(day =>
                  <MenuItem value={day} key={day}>{days[day]}</MenuItem>)}
              </Select>
            )}
          />
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                ref={null}
                id="type"
                label="Typ"
                required
                error={!!errors.type}
              >
                <MenuItem value={AuctionType.auction}><Gavel />Aukcja</MenuItem>
                <MenuItem value={AuctionType.auction}><Casino />Cegiełki</MenuItem>
                <MenuItem value={AuctionType.auction}><ShoppingCart />Kup teraz</MenuItem>
              </Select>
            )}
          />

          {auction && <Controller
            name="winnerAmount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                ref={null}
                id="winnerAmount"
                label="Kwota końcowa"
                type="number"
                error={!!errors.winnerAmount}
                helperText={errors.winnerAmount?.message ?? ' '}
              />
            )}
          />}
          {auction && <Controller
            name="winnerName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                ref={null}
                id="winnerName"
                label="Wygrany"
                error={!!errors.winnerName}
                helperText={errors.winnerName?.message ?? ' '}
              />
            )}
          />}
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                ref={null}
                id="notes"
                label="notatki"
                multiline
                error={!!errors.notes}
                helperText={errors.notes?.message ?? ' '}
              />
            )}
          />
          <Button type="submit" variant="contained" size="large">Zapisz</Button>
        </Stack>
      </form>
    </Box>
};
