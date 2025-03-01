import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the transaction count store interface
interface TransactionCountState {
  // Map of block numbers to transaction count
  transactionCounts: Record<number, number>;

  // Actions
  setTransactionCount: (blockNumber: number, count: number) => void;
  addTransactions: (blockNumber: number, additionalCount: number) => void;
  getTransactionCount: (blockNumber: number) => number | undefined;
  clear: () => void;
}

// Create the transaction count store with persistence
export const useTransactionCountStore = create<TransactionCountState>()(
  persist(
    (set, get) => ({
      transactionCounts: {},

      // Set transaction count for a block number
      setTransactionCount: (blockNumber: number, count: number) => {
        set((state) => {
          console.log(
            `Setting transaction count for block number ${blockNumber}: ${count}`
          );

          return {
            transactionCounts: {
              ...state.transactionCounts,
              [blockNumber]: count
            }
          };
        });
      },

      // Add transactions to an existing block
      // NOTE: This is only used for regular blocks, not flashblocks
      // For flashblocks, we always use setTransactionCount to avoid accumulation
      addTransactions: (blockNumber: number, additionalCount: number) => {
        set((state) => {
          const currentCount = state.transactionCounts[blockNumber] || 0;
          const newCount = currentCount + additionalCount;

          console.log(
            `Adding ${additionalCount} transactions to block ${blockNumber}: ${currentCount} -> ${newCount}`
          );

          return {
            transactionCounts: {
              ...state.transactionCounts,
              [blockNumber]: newCount
            }
          };
        });
      },

      // Get transaction count by block number
      getTransactionCount: (blockNumber: number) => {
        return get().transactionCounts[blockNumber];
      },

      // Clear all transaction counts
      clear: () => {
        set({ transactionCounts: {} });
      }
    }),
    {
      name: 'transaction-counts-storage'
    }
  )
);
