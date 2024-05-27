"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TableSortLabel,
  Box,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AuctionListView({
  params,
}: {
  params: { groupId: string };
}) {
  const router = useRouter();
  const { data: users, error } = api.fbUsers.listWithInfo.useQuery();
  const [order, setOrder] = useState<{
    name: string;
    order: "asc" | "desc" | undefined;
  }>();
  const [sortedUser, setSortedUsers] = useState(users);

  if (error && error.data?.code === "UNAUTHORIZED") {
    router.push("/api/auth/signin");
  }

  useEffect(() => {
    if (order && order.name === "count") {
      setSortedUsers(
        users?.sort((user1, user2) =>
          order.order === "desc"
            ? user1.auctions - user2.auctions
            : user2.auctions - user1.auctions
        )
      );
    } else if(order && order.name === 'sum') {
      setSortedUsers(users?.sort((user1, user2) => {
        const sum1 = user1.sum.winnerAmount || 0;
        const sum2 = user2.sum.winnerAmount || 0;
        return order.order === 'asc' ? sum1 - sum2 : sum2 - sum1;}
      ))
    } else {
      setSortedUsers(users);
    }
  }, [order, users]);

  return (
    <main>
      <TableContainer component={Paper}>
        <Table aria-label="list of users">
          <TableHead>
            <TableRow>
              <TableCell>Darczyńca</TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={order?.name === "count"}
                  direction={order?.name === "count" ? order?.order : "asc"}
                  onClick={() =>
                    setOrder({
                      name: "count",
                      order:
                        order?.name === "count" && order?.order === "asc"
                          ? "desc"
                          : "asc",
                    })
                  }
                >
                  Liczba licytacji
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={order?.name === "sum"}
                  direction={order?.name === "sum" ? order?.order : "asc"}
                  onClick={() =>
                    setOrder({
                      name: "sum",
                      order:
                        order?.name === "sum" && order?.order === "asc"
                          ? "desc"
                          : "asc",
                    })
                  }
                >
                  Suma z licytacji
                </TableSortLabel>
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUser?.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <a
                    href={`https://www.facebook.com/groups/325336195551284/search/?q=${row.user?.name}`}
                    target="_blank"
                  >
                    {row.user?.name}
                  </a>
                </TableCell>
                <TableCell align="right">{row.auctions}</TableCell>
                <TableCell align="right">{row.sum.winnerAmount} zł</TableCell>
                <TableCell>
                  <Link href={`/${params.groupId}/fb-users/${row.id}`}>
                    <Button>
                      <Edit />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </main>
  );
}
