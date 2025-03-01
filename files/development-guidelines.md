# Development Guidelines

This document outlines the key development guidelines and standards for this project.

## Core Philosophy

1. **Simplicity Over Complexity**:
   - Do not experiment or overcomplicate implementations
   - Build with precision, implementing exactly what is required without adding extra features
   - Avoid improvisations that deviate from the established patterns
   - If something is not explicitly required, do not build it
   - Focus on maintainability and clarity over cleverness

## Component Organization

1. **Route-Based Components**: Place components unique to a specific route in that route's `/components` directory
2. **Shared Components**: If a component is used in multiple routes, move it to the shared `/components` directory

## Data Management

3. **Data Flow**: Follow the services → actions → components pattern (see [data-flow.md](./data-flow.md))
4. **Formatting**: All data formatting functions must be placed in `/lib/utils/formatters.ts`
   - Formats include: currency, dates, addresses, percentages, numbers, etc.
   - Formatting functions should be pure and follow the naming pattern: `format[Entity][Property]`
   - Examples: `formatWalletAddress`, `formatTokenAmount`, `formatTimestampToDate`
   - **Important**: Formatter functions should ONLY be used in components, never in actions or services

## Server-Side Code

5. **Actions**: Should be thin wrappers around service methods

   - Actions should not perform data formatting or transformation
   - Actions should directly return service calls and handle errors
   - **REQUIRED**: Every file in `/actions` must include `'use server'` at the top (after imports)
   - **REQUIRED**: All exported functions from actions must be async functions (`export async function ...`)

6. **Services**: External data interactions
   - Client services should follow naming convention `[Service]Client.ts` (e.g., `FlashblockClient.ts`)
   - **REQUIRED**: Client services (`FlashblockClient.ts`, `FarcasterClient.ts`, etc.) MUST be implemented as singleton classes
   - Server-only services must include `import 'server-only'` at the top
   - **REQUIRED**: All exported functions from server-only services must be async functions (`export async function ...`)
   - Client services typically export singleton instances
   - Server services typically export async functions

## Client-Side Code

7. **Client-Side Data Fetching**: Use TanStack Query (React Query) for all API calls
   - Create custom hooks that wrap query and mutation hooks
   - Implement proper error handling, loading states, and retry logic
   - Use query keys that follow a consistent pattern (e.g., ['users', userId])
   - Leverage query invalidation for data refetching

## Code Style & Organization

8. **Imports**: Use the following import patterns for consistency:

   - Use absolute imports with `@/` alias for any imports that go beyond one directory level
   - Example: Use `import FlashblocksStatus from '@/components/FlashblocksStatus';` instead of relative paths like `../../components/FlashblocksStatus`
   - Only use relative imports (`./` or `../`) when importing from the same directory or directly adjacent parent directory

9. **Type Safety**: Define and use TypeScript interfaces for all data structures

10. **Server Components**: Leverage React Server Components where appropriate to reduce client-side JavaScript

11. **Error Handling**: Implement proper error boundaries and fallback UI for failed data fetching

12. **Naming Conventions**: Use consistent naming across the codebase

- React components: PascalCase
- Functions, variables: camelCase
- Files: kebab-case for components, camelCase for utilities

## React Query Best Practices

### Query Keys

- Use structured keys with factories for consistent key generation
- Include relevant parameters in keys to ensure proper cache invalidation
- Follow the format: `[entity, ...identifiers]`

### Stale Time and Cache Time

- Configure appropriate stale times based on data volatility
- Set longer cache times for data that doesn't change frequently

### Error Handling

- Implement proper error handling with retry logic
- Use error boundaries at component level for fallback UI

### Optimistic Updates

- Use optimistic updates for mutations to improve perceived performance
- Always provide a rollback mechanism in case of failure

### Prefetching

- Prefetch data when appropriate (e.g., on hover, on page load)
- Use suspense boundaries for loading states when prefetching

### Infinite Queries

- Use `useInfiniteQuery` for paginated data
- Implement proper intersection observers for infinite scrolling

### Query Invalidation

- Be specific with invalidation queries to avoid unnecessary refetches
- Use the query key factory to ensure consistency
