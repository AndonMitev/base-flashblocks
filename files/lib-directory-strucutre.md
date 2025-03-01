# Lib Directory Structure

The `/lib` directory contains the core logic of the application, separated into logical subdirectories.

## Structure

- **/services**: Handles external data interactions

  - Contains client service files (`FlashblockClient.ts`, `SupabaseClient.ts`, `FarcasterClient.ts`, etc.)
  - Files should follow the naming convention: `[Service]Client.ts` for client-side services
  - **IMPORTANT**: Client services (`FlashblockClient.ts`, `FarcasterClient.ts`, etc.) MUST be implemented as singleton classes
  - Server-only services should include `import 'server-only'` at the top
  - **REQUIRED**: All exported functions from server-only services must be async functions (`export async function ...`)
  - Each service should export specific functions or a singleton instance

- **/utils**: Helper functions and utilities

  - **/formatters.ts**: All data formatting functions (currency, dates, addresses, etc.)
  - **/validators.ts**: Input validation helpers
  - **/constants.ts**: Application-wide constants
  - **/hooks/**: Custom React hooks (not related to data fetching)
  - Each utility should be pure and have a single responsibility
  - Common utility functions should be prefixed with their type (e.g., `formatAddress`, `validateEmail`)

- **/hooks**: Custom React Query hooks for data fetching

  - Organized by domain/feature (e.g., `useTokenData.ts`, `useUserProfile.ts`)
  - Implements best practices for caching, error handling, and optimistic updates
  - Uses consistent query key patterns
  - Exports custom hooks that wrap TanStack Query's hooks

- **/actions**: Server actions that consume services

  - Implements Server Actions pattern from Next.js
  - Acts as intermediaries between UI and services
  - Can be consumed by both client and server components
  - Should be organized by domain/feature (e.g., `userActions.ts`, `authActions.ts`)
  - Should handle error states and return appropriate responses
  - **IMPORTANT**: Every file in `/actions` must include `'use server'` at the top to mark it as a server action
  - **REQUIRED**: All exported functions from actions must be async functions (`export async function ...`)
  - If the file has imports, `'use server'` should be the first line after the imports

- **/types**: TypeScript type definitions
  - Shared interfaces
  - Type declarations
  - Should follow naming convention: `EntityType.ts` or `domain.types.ts`
  - Consider using type composition and utility types for DRY principles

## Examples

### Client Service Example (Flashblocks WebSocket)

```typescript
// lib/services/FlashblockClient.ts
import { FlashblocksPayload } from '../types/flashblocks';

// Only run this code on the client side
const isBrowser = typeof window !== 'undefined';

// Client services MUST be implemented as singleton classes
class FlashblockClient {
  private static instance: FlashblockClient;
  private socket: WebSocket | null = null;
  private listeners: Set<(data: FlashblocksPayload) => void> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private url = 'wss://sepolia.flashblocks.base.org/ws';
  private isConnecting = false;
  private isBrowser = isBrowser;

  // Private constructor prevents direct instantiation
  private constructor() {}

  // Singleton pattern implementation
  static getInstance() {
    if (!FlashblockClient.instance) {
      FlashblockClient.instance = new FlashblockClient();
    }
    return FlashblockClient.instance;
  }

  // Methods for connecting, subscribing, etc.

  isConnected(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

// Create and export a singleton instance
export const flashblockClient = FlashblockClient.getInstance();
```

### Server-Only Service Example

```typescript
// lib/services/UserService.ts
import 'server-only';
import { db } from './db';
import type { User } from '../types/user';

export async function getUserById(id: string): Promise<User> {
  const user = await db.users.findUnique({
    where: { id }
  });

  if (!user) {
    throw new Error(`User with ID ${id} not found`);
  }

  return user;
}

export async function updateUserProfile(id: string, data: Partial<User>): Promise<User> {
  return await db.users.update({
    where: { id },
    data
  });
}
```

### Server Action Example

```typescript
// lib/actions/userActions.ts
import { getUserById, updateUserProfile } from '../services/UserService';

'use server';

export async function getUser(id: string) {
  try {
    return await getUserById(id);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user data');
  }
}

export async function updateUser(id: string, data: any) {
  try {
    return await updateUserProfile(id, data);
  } catch (error) {
    console.error('Failed to update user:', error);
    throw new Error('Failed to update user profile');
  }
}
```
