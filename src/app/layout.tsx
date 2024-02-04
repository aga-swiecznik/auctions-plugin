import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";

import { Footer } from "./_components/Footer";

import { ThemeRegistry } from "./theme/ThemeRegistry";
import NextAuthProvider from "./AuthProvider";
import dayjs from "dayjs";

require('dayjs/locale/pl')
dayjs.locale('pl')

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Aukcje",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
            <TRPCReactProvider headers={headers()}>
              <>
                {children}
                <Footer />
              </>
            </TRPCReactProvider>
          </ThemeRegistry>
        </NextAuthProvider>
      </body>
    </html>
  );
}
