# Project Architecture

This document outlines the high-level architecture and directory structure of the application.

## Directory Structure

The application follows a structured organization approach to maintain scalability and separation of concerns:

```
/app
  /(home)
      page.tsx
      /components - home-specific components
  /flashblocks
      page.tsx
      /components - flashblock-specific components
/components - shared components and providers
  /ui - reusable UI components
  /providers
    QueryProvider.tsx - TanStack Query provider setup
/lib
  /services - external data interactions
    FlashblockClient.ts - WebSocket client for Flashblocks
    SupabaseClient.ts - Supabase database client
    FarcasterClient.ts - Farcaster API client
    UserService.ts - Server-only user operations
  /utils - reusable utilities
    formatters.ts - centralized formatting functions
  /actions - server actions
  /types - TypeScript types/interfaces
  /hooks - custom React Query hooks
```

## Key Directories and Their Purpose

### `/app` Directory

Contains all route-based pages and their unique components following Next.js App Router structure:

- **/(home)**: Main landing page (root route)
- **/flashblocks**: Feature-specific page
- Each route can have its own `/components` directory containing components used only within that specific route

### `/components` Directory

Contains shared components that are used across multiple routes and global providers:

- **/ui**: Reusable UI components
- **/providers**: Application wrapper providers (auth, theme, query, etc.)

### `/lib` Directory

Contains the core logic of the application (see [lib-structure.md](./lib-structure.md) for detailed information).
