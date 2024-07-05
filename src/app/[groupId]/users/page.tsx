"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
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
  IconButton,
} from "@mui/material";
import { Edit, KeyboardBackspace } from "@mui/icons-material";
import Link from "next/link";
import { checkAdmin } from "~/server/utils/checkAdmin";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { UserDialog } from "./userDialog";

export default function AuctionListView({
  params,
}: {
  params: { groupId: string };
}) {
  // TODO use groupId
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { data: users, error } = api.users.list.useQuery();
  const [userDialogOpen, setUserDialogOpen] = useState<boolean | Omit<User, "password">>(false);
  if (error && error.data?.code === "UNAUTHORIZED") {
    router.push("/api/auth/signin");
  }

  if(!sessionData || !sessionData.user || !checkAdmin(sessionData?.user?.name)) return null;

  return (
    <main>
      <h1>
        <Link href={`/${params.groupId}/`}>
          <IconButton>
            <KeyboardBackspace />
          </IconButton>
        </Link>
        Użytkownicy
        <Button
          autoFocus
          variant="contained"
          sx={{ ml: 2 }}
          onClick={() => setUserDialogOpen(true)}
        >
          Dodaj nowe konto
        </Button>
      </h1>

      <TableContainer component={Paper}>
        <Table aria-label="list of users">
          <TableHead>
            <TableRow>
              <TableCell>Uzytkownik</TableCell>
              <TableCell>
                  Liczba zaakceptowanych licytacji
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.count}
                </TableCell>
                <TableCell>
                  <Button onClick={() => setUserDialogOpen(row)}>
                    <Edit />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <UserDialog user={userDialogOpen} setUser={setUserDialogOpen}/>
    </main>
  );
}
