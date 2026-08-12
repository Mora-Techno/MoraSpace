import "@/styles/globals.css";
import "@aejkatappaja/phantom-ui/ssr.css";

import { Nunito, Playfair_Display } from "next/font/google";

import { metadata, siteConfig } from "./metadata";
import { AppProviders } from "./providers";
export { metadata };
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={siteConfig.locale} suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${nunito.variable} ghibli-bg min-h-screen`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
