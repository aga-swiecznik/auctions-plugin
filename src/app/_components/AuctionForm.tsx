"use client";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
  Casino,
  Error,
  Gavel,
  ShoppingCart,
  ThumbUp,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Auction, AuctionDTO } from "~/models/Auction";
import { AuctionType } from "~/models/AuctionType";
import { useAuctionMutation } from "~/utils/useAuctionMutation";
import { UserSelect } from "./UserSelect";
import { ChangeEvent, useEffect, useState } from "react";

export const AuctionForm = ({
  auction,
  id,
  groupId,
}: {
  auction?: Auction;
  id?: string;
  groupId: string;
}) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const updateMutation = useAuctionMutation();
  const createMutation = api.auction.create.useMutation({
    onSuccess: () => {
      if (!!localStorage.getItem("showNewForm")) {
        location.replace(`/${groupId}/posts/new`);
      } else {
        router.push(`/${groupId}`);
      }
    },
    onError: (data) =>
      setError(
        data.shape?.code === -32603
          ? "Ktoś juz prawdopodobnie dodał tą aukcję"
          : data.message
      ),
  });

  useEffect(() => {
    const item = localStorage.getItem("showNewForm");
    setShowNewForm(!!item);
  }, []);

  const onSubmit = (values: AuctionDTO) => {
    if (!auction) {
      createMutation.mutate(
        { auction: { ...values, author: values.author?.id ?? "" }, groupId },
        {
          onError: (e) => console.log(e),
        }
      );
    } else {
      updateMutation.mutate({
        auction: {
          ...values,
          author: values.author?.id ?? "",
          winner: values.winner?.id,
        },
      });
    }
  };

  const endDate = dayjs().add(2, "days").format("YYYY-MM-DD");
  const defaultValues = {
    id: id ?? "",
    author: auction?.author,
    notes: auction?.notes ?? "",
    name: auction?.name ?? "",
    link:
      auction?.link ??
      (groupId && id
        ? `https://www.facebook.com/groups/${groupId}/posts/${id}`
        : ""),
    endsAt: auction?.endsAt
      ? dayjs(auction?.endsAt).format("YYYY-MM-DD")
      : endDate,
    type: auction?.type ?? AuctionType.auction,
    winnerAmount: auction?.winnerAmount ?? 0,
    winner: auction?.winner,
  };

  const today = dayjs();

  const days: { [key: string]: string } = {};

  if (auction?.endsAt) {
    days[dayjs(auction.endsAt).format("YYYY-MM-DD")] = dayjs(
      auction.endsAt
    ).format("ddd, DD.MM");
  }

  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((offset) => {
    const day = today.add(offset, "days");
    days[day.format("YYYY-MM-DD")] = dayjs(day).format("ddd, DD.MM");
  });

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuctionDTO>({
    mode: "onChange",
    defaultValues: defaultValues,
    values: defaultValues,
  });

  const handleCheckbox = (
    e: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    if (checked) {
      localStorage.setItem("showNewForm", "true");
    } else {
      localStorage.removeItem("showNewForm");
    }
    setShowNewForm(checked);
  };

  return (
    <Box>
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
                label="Link do aukcji"
                required
                error={!!errors.link}
                helperText={errors.link?.message}
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
                helperText={errors.name?.message}
              />
            )}
          />

          <UserSelect
            control={control}
            setValue={setValue}
            label="Darczyńca"
            name="author"
          />

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
                {Object.keys(days)
                  .sort()
                  .map((day) => (
                    <MenuItem value={day} key={day}>
                      {days[day]}
                    </MenuItem>
                  ))}
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
                <MenuItem value={AuctionType.auction}>
                  <Gavel />
                  Aukcja
                </MenuItem>
                <MenuItem value={AuctionType.bricks}>
                  <Casino />
                  Cegiełki
                </MenuItem>
                <MenuItem value={AuctionType.buyNow}>
                  <ShoppingCart />
                  Kup teraz
                </MenuItem>
                <MenuItem value={AuctionType.likes}>
                  <ThumbUp />
                  Lajki
                </MenuItem>
              </Select>
            )}
          />

          {auction && (
            <Controller
              name="winnerAmount"
              control={control}
              rules={{}}
              render={({ field }) => (
                <TextField
                  {...field}
                  ref={null}
                  id="winnerAmount"
                  label="Kwota końcowa"
                  type="number"
                  onChange={(event) => field.onChange(+event.target.value)}
                  error={!!errors.winnerAmount}
                  helperText={errors.winnerAmount?.message}
                />
              )}
            />
          )}
          {auction && (
            <UserSelect<AuctionDTO>
              control={control}
              setValue={setValue}
              label="Wygrywający"
              name="winner"
            />
          )}
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                ref={null}
                id="notes"
                label="Notatki"
                multiline
                error={!!errors.notes}
                helperText={errors.notes?.message}
              />
            )}
          />
          {error && (
            <Alert color="error" icon={<Error />}>
              {error}
            </Alert>
          )}
          <Button type="submit" variant="contained" size="large">
            Zapisz
          </Button>

          <Box sx={{ mt: 3 }}>
            <Checkbox checked={showNewForm} onChange={handleCheckbox} />
            Po zapisaniu otwórz dodawanie nowej aukcji
          </Box>
        </Stack>
      </form>
    </Box>
  );
};
