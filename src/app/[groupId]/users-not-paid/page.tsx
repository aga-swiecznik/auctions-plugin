"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel
} from "@mui/material";
import { KeyboardBackspace } from "@mui/icons-material";
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
  const [order, setOrder] = useState<{
    name: string;
    order: "asc" | "desc";
  }>({ name: 'winner', order: 'asc' });
  const [sortedUser, setSortedUsers] = useState(data);

  if (error && error.data?.code === "UNAUTHORIZED") {
    router.push("/api/auth/signin");
  }

  useEffect(() => {
    const newUsers = data ? [...data] : [];
    console.log('123', order)
    if (order && order.name === "winner") {
        newUsers.sort((user1, user2) =>
          order.order === "desc"
            ? (user1.winner?.name || '').localeCompare(user2.winner?.name || '')
            : (user2.winner?.name || '').localeCompare(user1.winner?.name || '')
        )
    } else if (order && order.name === 'endsAt') {
      newUsers.sort((user1, user2) =>
        order.order === 'asc'
          ? user1.endsAt.getTime() - user2.endsAt.getTime()
          : user2.endsAt.getTime() - user1.endsAt.getTime()
      )
    } else if (order && order.name === 'amount') {
      newUsers.sort((user1, user2) =>
        order.order === 'asc'
          ? (user1.winnerAmount || 0) - (user2.winnerAmount || 0)
          : (user2.winnerAmount || 0) - (user1.winnerAmount || 0)
      )
    } else if (order && order.name === 'name') {
      newUsers.sort((user1, user2) =>
        order.order === 'asc'
          ? user1.name.localeCompare(user2.name)
          : user2.name.localeCompare(user1.name)
      )
    }
    setSortedUsers(newUsers);
  }, [order, data]);

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
                <TableCell>
                  <TableSortLabel
                    active={order?.name === "winner"}
                    direction={order?.name === "winner" ? order?.order : "asc"}
                    onClick={() =>
                      setOrder({
                        name: "winner",
                        order:
                          order?.name === "winner" && order?.order === "asc"
                            ? "desc"
                            : "asc",
                      })
                    }
                  >Wygrywający</TableSortLabel></TableCell>
                <TableCell><TableSortLabel
                  active={order?.name === "name"}
                  direction={order?.name === "name" ? order?.order : "asc"}
                  onClick={() =>
                    setOrder({
                      name: "name",
                      order:
                        order?.name === "name" && order?.order === "asc"
                          ? "desc"
                          : "asc",
                    })
                  }
                >Aukcja</TableSortLabel></TableCell>
                <TableCell><TableSortLabel
                  active={order?.name === "amount"}
                  direction={order?.name === "amount" ? order?.order : "asc"}
                  onClick={() =>
                    setOrder({
                      name: "amount",
                      order:
                        order?.name === "amount" && order?.order === "asc"
                          ? "desc"
                          : "asc",
                    })
                  }
                >Kwota</TableSortLabel></TableCell>
                <TableCell><TableSortLabel
                  active={order?.name === "endsAt"}
                  direction={order?.name === "endsAt" ? order?.order : "asc"}
                  onClick={() =>
                    setOrder({
                      name: "endsAt",
                      order:
                        order?.name === "endsAt" && order?.order === "asc"
                          ? "desc"
                          : "asc",
                    })
                  }
                >Data zakończenia</TableSortLabel></TableCell>
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
