'use client';

import { CoinbaseWalletProvider } from './Coinbase';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <CoinbaseWalletProvider>{children}</CoinbaseWalletProvider>;
}
