# Data Flow

This document describes the data flow patterns used in the application.

## Core Data Flow Pattern

1. **External data interactions** are handled by **/services**

   - Direct interactions with APIs, blockchain, and databases
   - Services should be focused on data operations without UI-specific logic
   - Services often implement singleton pattern for stateful connections (e.g., WebSockets)
   - Example: `flashblocks.ts` service implements WebSocket connection management

2. **Server actions** in **/actions** consume these services

   - Should be thin wrappers around service methods
   - Actions should only pass data through from services to components without formatting
   - Example: `isFlashblocksConnected()` action simply returns `flashblocks.isConnected()`
   - Actions should provide appropriate error responses and status codes

3. **Components** (both client and server) consume actions

   - Use actions to fetch or mutate data
   - Can be used in both client and server rendering contexts
   - Components should handle loading, error, and success states
   - Components are the only place where formatter functions should be used

4. **Formatting and Presentation**
   - Use utility functions from `/lib/utils/formatters.ts` for data presentation
   - Formatting should only happen in components, not in actions or services
   - Example: `formatTokenAmount`, `formatWalletAddress`, `formatTimestamp`
   - All formatting logic should be centralized in this file for consistency across the UI

## Client-Side Data Fetching with React Query

### Provider Setup

The Query provider should be set up at the root of your application:

```tsx
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
```

### Custom Hooks Structure

Create custom hooks that wrap React Query's hooks for better type-safety and reusability:

```typescript
// lib/hooks/useTokenData.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTokenBalance, updateTokenMetadata } from '@/lib/actions/tokenActions';
import type { TokenData } from '@/lib/types/token';

// Query key factory
const tokenKeys = {
  all: ['tokens'] as const,
  lists: () => [...tokenKeys.all, 'list'] as const,
  list: (filters: string) => [...tokenKeys.lists(), { filters }] as const,
  details: () => [...tokenKeys.all, 'detail'] as const,
  detail: (id: string) => [...tokenKeys.details(), id] as const,
};

// Custom hook for fetching token data
export function useTokenData(tokenId: string) {
  return useQuery({
    queryKey: tokenKeys.detail(tokenId),
    queryFn: () => fetchTokenBalance(tokenId),
    // Optional: configure per-query settings
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Custom hook for updating token metadata
export function useUpdateTokenMetadata() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { tokenId: string; metadata: Partial<TokenData> }) =>
      updateTokenMetadata(data.tokenId, data.metadata),

    // Update the cache optimistically
    onMutate: async (data) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: tokenKeys.detail(data.tokenId) });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<TokenData>(tokenKeys.detail(data.tokenId));

      // Optimistically update the cache
      queryClient.setQueryData<TokenData>(tokenKeys.detail(data.tokenId), (old) => ({
        ...old!,
        ...data.metadata,
      }));

      // Return the previous value in case of rollback
      return { previousData };
    },

    // If mutation fails, roll back to the previous value
    onError: (err, data, context) => {
      queryClient.setQueryData(
        tokenKeys.detail(data.tokenId),
        context?.previousData
      );
    },

    // Refetch after success if needed
    onSuccess: (result, data) => {
      queryClient.invalidateQueries({ queryKey: tokenKeys.detail(data.tokenId) });
    },
  });
}
```

### Usage in Components

```tsx
// components/TokenDisplay.tsx
'use client';

import { useTokenData, useUpdateTokenMetadata } from '@/lib/hooks/useTokenData';
import { formatTokenAmount } from '@/lib/utils/formatters';

export default function TokenDisplay({ tokenId }: { tokenId: string }) {
  const { data, isLoading, error } = useTokenData(tokenId);
  const { mutate, isPending } = useUpdateTokenMetadata();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>{data.name}</h2>
      <p>Balance: {formatTokenAmount(data.balance, data.decimals)}</p>
      <button
        disabled={isPending}
        onClick={() => mutate({
          tokenId,
          metadata: { lastViewed: new Date().toISOString() }
        })}
      >
        {isPending ? 'Updating...' : 'Update Last Viewed'}
      </button>
    </div>
  );
}
```

## Special Considerations for Services

Since services often need to interact with both server and client environments, you might encounter cases where a service needs different implementations:

### Client-Side Services

For WebSockets, browser APIs, or client-only features, create a dedicated client service:

```typescript
// lib/services/client/flashblocksClient.ts
// NO server-only import here since this is meant for client use

import { FlashblocksPayload } from '../../types/flashblocks';

class FlashblocksClient {
  // Client-side implementation with WebSocket, etc.
}

export const flashblocksClient = FlashblocksClient.getInstance();
```

### Server-Side Services

For database access, authentication, or sensitive API calls, use server-only services:

```typescript
// lib/services/database.ts
import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function getUserData(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
```
