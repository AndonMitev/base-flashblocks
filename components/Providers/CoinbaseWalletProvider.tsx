'use client';

import {
  createCoinbaseWalletSDK,
  getCryptoKeyAccount,
  ProviderInterface
} from '@coinbase/wallet-sdk';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
  useCallback
} from 'react';
import { Address, createWalletClient, custom } from 'viem';
import { baseSepolia } from 'viem/chains';

interface CoinbaseWalletContextType {
  provider: ProviderInterface | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  address: Address | null;
  subAccount: string | null;
  createSubAccount: () => Promise<Address | null>;
}

const CoinbaseWalletContext = createContext<CoinbaseWalletContextType>({
  provider: null,
  connect: async () => {},
  disconnect: () => {},
  isConnected: false,
  address: null,
  subAccount: null,
  createSubAccount: async () => null
});

export function CoinbaseWalletProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ProviderInterface | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);
  const [subAccount, setSubAccount] = useState<string | null>(null);

  // Initialize Coinbase Wallet SDK
  useEffect(() => {
    const coinbaseWalletSDK = createCoinbaseWalletSDK({
      appName: 'Base subaccounts showcase',
      appChainIds: [baseSepolia.id],
      preference: {
        options: 'smartWalletOnly',
        keysUrl: 'https://keys-dev.coinbase.com/connect'
      },
      subaccount: {
        getSigner: getCryptoKeyAccount
      }
    });
    setProvider(coinbaseWalletSDK.getProvider());
  }, []);

  // Initialize Wallet Client
  const walletClient = useMemo(() => {
    if (!provider) return null;
    return createWalletClient({
      chain: baseSepolia,
      transport: custom({
        async request({ method, params }) {
          const response = await provider.request({ method, params });
          return response;
        }
      })
    });
  }, [provider]);

  const connect = useCallback(async () => {
    if (!walletClient || !provider) return;
    walletClient.requestAddresses().then(async (addresses) => {
      if (addresses.length > 0) {
        setAddress(addresses[0]);
        setIsConnected(true);
      }
    });
  }, [walletClient, provider]);

  const disconnect = () => {
    if (!provider) return;
    try {
      provider.disconnect();
      setIsConnected(false);
      setAddress(null);
    } catch (error) {
      console.error('Failed to disconnect from Coinbase Wallet:', error);
    }
  };

  const createSubAccount = useCallback(async () => {
    if (!provider || !address) {
      throw new Error('Address or provider not found');
    }

    const signer = await getCryptoKeyAccount();

    const walletConnectResponse = (await provider.request({
      method: 'wallet_connect',
      params: [
        {
          version: '1',
          capabilities: {
            addSubAccount: {
              account: {
                type: 'create',
                keys: [
                  {
                    type: 'webauthn-p256',
                    signer: signer.account?.publicKey
                  }
                ]
              }
            }
          }
        }
      ]
    })) as {
      accounts: {
        address: Address;
        capabilities: {
          addSubAccount: {
            address: Address;
          };
        };
      }[];
    };

    const { addSubAccount } = walletConnectResponse.accounts[0].capabilities;
    const subAccount = addSubAccount.address;
    setSubAccount(subAccount);

    return subAccount;
  }, [provider, address]);

  return (
    <CoinbaseWalletContext.Provider
      value={{
        provider,
        connect,
        disconnect,
        isConnected,
        address,
        subAccount,
        createSubAccount
      }}
    >
      {children}
    </CoinbaseWalletContext.Provider>
  );
}

export function useCoinbaseWallet() {
  const context = useContext(CoinbaseWalletContext);
  if (context === undefined) {
    throw new Error(
      'useCoinbaseWallet must be used within a CoinbaseWalletProvider'
    );
  }
  return context;
}
