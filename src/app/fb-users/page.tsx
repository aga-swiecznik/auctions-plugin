'use client';

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import { Edit } from "@mui/icons-material";
import Link from "next/link";

export default function AuctionListView({ params }: { params: { groupId: string } }) {
  const router = useRouter();
  const { data: users, error } = api.fbUsers.listWithInfo.useQuery();

  if(error && error.data?.code === 'UNAUTHORIZED') {
    router.push('/api/auth/signin');
  }

  return (
    <main>
      <TableContainer component={Paper}>
      <Table aria-label="list of users">
        <TableHead>
          <TableRow>
            <TableCell>Darczyńca</TableCell>
            <TableCell align="right">Liczba licytacji</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <a href={`https://www.facebook.com/groups/325336195551284/search/?q=${row.user?.name}`} target="_blank">
                  {row.user?.name}
                </a>
              </TableCell>
              <TableCell align="right">{row.auctions}</TableCell>
              <TableCell>
                <Link href={`/fb-users/${row.id}`}><Button><Edit /></Button></Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </main>
  );
}
