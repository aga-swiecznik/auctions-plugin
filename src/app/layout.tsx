import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";

import { Nav } from "./_components/Nav";

import { ThemeRegistry } from "./theme/ThemeRegistry";
import NextAuthProvider from "./AuthProvider";
import dayjs from "dayjs";
import { Box, Stack } from "@mui/material";
import { CopyDialog } from "./_components/CopyDialog";

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
              <Stack sx={{
                padding: 1, pb: '60px',
                flexDirection: {xs: 'column', md: 'row'},
                backgroundColor: '#fcfcfc',
                minHeight: '100vh',
                justifyContent: { xs: 'flex-start', md: 'center' }
              }}>
                <Nav />
                <Box sx={{width: { md: 650, lg: 900 }}}>
                  {children}
                </Box>
                <CopyDialog />
              </Stack>
            </TRPCReactProvider>
          </ThemeRegistry>
        </NextAuthProvider>
      </body>
    </html>
  );
}
