import '@/styles/globals.css';
import '@aejkatappaja/phantom-ui/ssr.css';

import { DM_Sans, Fraunces } from 'next/font/google';

import { metadata, siteConfig } from './metadata';
import { AppProviders } from './providers';
export { metadata };
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.locale} suppressHydrationWarning>
      <body className={`${dmSans.variable} ${fraunces.variable} ghibli-bg min-h-screen`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
