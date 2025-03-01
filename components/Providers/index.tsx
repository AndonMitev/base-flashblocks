'use client';

import { CoinbaseWalletProvider } from './CoinbaseWalletProvider';
import { QueryProvider } from './QueryProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CoinbaseWalletProvider>
      <QueryProvider>{children}</QueryProvider>
    </CoinbaseWalletProvider>
  );
}
