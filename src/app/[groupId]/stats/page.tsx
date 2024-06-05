"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { CSVLink, CSVDownload } from "react-csv";
import { Box, Button, IconButton, Paper, Typography, } from "@mui/material";
import { KeyboardBackspace } from "@mui/icons-material";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from "recharts";

export default function AuctionListView({
  params,
}: {
  params: { groupId: string };
}) {
  const router = useRouter();
  const { data, error } = api.auction.stats.useQuery({
    groupId: params.groupId,
  });
  const { data: csvData, error: csvError } = api.auction.statsCSV.useQuery({
    groupId: params.groupId,
  });

  if (error && error.data?.code === "UNAUTHORIZED") {
    router.push("/api/auth/signin");
  }

  if (!data) return;

  return (
    <main>
      <h1>
        <Link href={`/${params.groupId}/`}>
          <IconButton>
            <KeyboardBackspace />
          </IconButton>
        </Link>
        Statystyki
        { csvData ? <CSVLink data={csvData.data} target="_blank"><Button
          autoFocus
          variant="contained"
          sx={{ ml: 2 }}
        >
          Pobierz
        </Button></CSVLink> : null}
      </h1>
      
      <Paper sx={{ mt: 2, p: 2, textAlign: 'center' }}>
        <Typography variant="h2">Liczba licytacji</Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data.days}>
              <CartesianGrid strokeDasharray="1 3" />
              <XAxis dataKey="endsAt" interval={7} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="noOffers" stackId="a" fill="#1e88e5" />
              <Bar dataKey="offers" stackId="a" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
            
      <Paper sx={{ mt: 2, p: 2, textAlign: 'center' }}>
        <Typography variant="h2">Kwota licytacji</Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data.days}>
              <CartesianGrid strokeDasharray="1 3" />
              <XAxis dataKey="endsAt" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sum" fill="#1e88e5" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Paper sx={{ mt: 2, p: 2, textAlign: 'center' }}>
        <Typography variant="h2">Postęp</Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer>
          <AreaChart data={data.stats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="amount" />
            <YAxis yAxisId="increase" orientation="right" />
            <Tooltip />
            <Area type="monotone" yAxisId="amount" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
            <Area type="monotone" yAxisId="increase" dataKey="increase" stroke="#1e88e5" fill="#1e88e5" />
          </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </main>
  );
}
