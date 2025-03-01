import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Flashblock Base Explorer',
  description:
    'A powerful explorer for Flashblock Base - navigate, search, and analyze blockchain data with ease',
  keywords: [
    'blockchain',
    'explorer',
    'flashblock',
    'base',
    'crypto',
    'transactions',
    'blocks',
    'web3'
  ],
  authors: [{ name: 'Flashblock Team' }],
  creator: 'Flashblock',
  publisher: 'Flashblock',
  openGraph: {
    title: 'Flashblock Base Explorer',
    description:
      'Explore the Base blockchain with our powerful and intuitive explorer',
    url: 'https://explorer.flashblock.io',
    siteName: 'Flashblock Base Explorer',
    images: [
      {
        url: '/base-logo.png',
        width: 512,
        height: 512,
        alt: 'Base Logo - Flashblock Base Explorer'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flashblock Base Explorer',
    description:
      'Explore the Base blockchain with our powerful and intuitive explorer',
    images: ['/base-logo.png'],
    creator: '@flashblock'
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
  category: 'Technology',
  icons: {
    icon: '/base-logo.png',
    apple: '/base-logo.png'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      {/* <script
        crossOrigin='anonymous'
        src='//unpkg.com/react-scan/dist/auto.global.js'
      /> */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
