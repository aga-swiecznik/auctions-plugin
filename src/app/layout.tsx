import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";

import { Nav } from "./_components/Nav";

import { ThemeRegistry } from "./theme/ThemeRegistry";
import NextAuthProvider from "./AuthProvider";
import dayjs from "dayjs";
import { Box, Stack } from "@mui/material";

require('dayjs/locale/pl')
dayjs.locale('pl')

export const metadata = {
  title: "Licytacje dla Bruna",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        <NextAuthProvider>
          <ThemeRegistry options={{ key: 'mui' }}>
            <TRPCReactProvider>
              <Stack sx={{ justifyContent: 'center', padding: 2, flexDirection: {xs: 'column', md: 'row'} }}>
                <Nav />
                <Box sx={{width: { md: 650, lg: 900 }}}>
                  {children}
                </Box>
              </Stack>
            </TRPCReactProvider>
          </ThemeRegistry>
        </NextAuthProvider>
      </body>
    </html>
  );
}
