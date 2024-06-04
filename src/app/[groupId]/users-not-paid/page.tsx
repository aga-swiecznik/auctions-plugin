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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { numberToEmoji } from "~/utils/numberToEmoji";
import { Edit, KeyboardBackspace } from "@mui/icons-material";
import Link from "next/link";

export default function UsersNotPaid({
  params,
}: {
  params: { groupId: string };
}) {
  const router = useRouter();
  const { data, error } = api.auction.usersNotPaid.useQuery({
    groupId: params.groupId,
  });

  if (error && error.data?.code === "UNAUTHORIZED") {
    router.push("/api/auth/signin");
  }

  return (
    <main>
      <h1>
        <Link href={`/${params.groupId}/`}>
          <IconButton>
            <KeyboardBackspace />
          </IconButton>
        </Link>
        Uzytkownicy, którzy nie opłacili licytacji
      </h1>
      
      <Paper sx={{ mt: 2, p: 2 }}>
      <TableContainer component={Paper}>
        <Table aria-label="list of users">
          <TableHead>
            <TableRow>
              <TableCell>Wygrywający</TableCell>
              <TableCell>Aukcja</TableCell>
              <TableCell>Kwota</TableCell>
              <TableCell>Data zakończenia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <a
                    href={`https://www.facebook.com/groups/325336195551284/search/?q=${row.winner?.name}`}
                    target="_blank"
                  >
                    {row.winner?.name}
                  </a>
                </TableCell>
                <TableCell><Link href={`/${params.groupId}/posts/${row.id}`}>{row.name}</Link></TableCell>
                <TableCell>{row.winnerAmount} zł</TableCell>
                <TableCell>
                  {dayjs(row.endsAt).format('ddd, DD.MM')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>
    </main>
  );
}
