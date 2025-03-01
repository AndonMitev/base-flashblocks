'use client';

import { CoinbaseWalletProvider } from './providers/CoinbaseWalletProvider';
import { QueryProvider } from './providers/QueryProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CoinbaseWalletProvider>
      <QueryProvider>{children}</QueryProvider>
    </CoinbaseWalletProvider>
  );
}
