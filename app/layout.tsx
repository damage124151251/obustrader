import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OBUS Trader | AI-Powered Memecoin Trading Bot',
  description: 'Autonomous AI trading bot for Solana memecoins. 100% profit distribution to token holders.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'OBUS Trader',
    description: 'Autonomous AI trading bot for Solana memecoins',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OBUS Trader',
    description: 'Autonomous AI trading bot for Solana memecoins',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
