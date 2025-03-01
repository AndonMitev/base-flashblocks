'use client';

import { useCoinbaseWallet } from '@/components/providers/CoinbaseWalletProvider';

export function ConnectButton() {
  const {
    isConnected,
    connect,
    disconnect,
    address,
    subAccount,
    createSubAccount
  } = useCoinbaseWallet();

  if (!isConnected) {
    return (
      <div>
        <button onClick={connect}>Connect Wallet</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p>Connected address: {address}</p>

      {!subAccount && (
        <button onClick={createSubAccount}>Create Sub Account</button>
      )}

      {subAccount && <p>Sub Account address: {subAccount}</p>}

      <button onClick={disconnect}>Disconnect Wallet</button>
    </div>
  );
}
