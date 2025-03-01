# Next.js Web3 Project (pnpm)

This documentation serves as a guide for both developers and AI assistants (Claude, Cursor) to understand the architecture and development patterns used in this project.

## Documentation Structure

This project documentation is split into several focused files for easier reference:

- [**stack.md**](./stack.md) - Tech stack and tools used in the project
- [**architecture.md**](./architecture.md) - High-level project architecture and directory structure
- [**lib-structure.md**](./lib-structure.md) - Detailed explanation of the `/lib` directory organization
- [**data-flow.md**](./data-flow.md) - Data flow patterns with React Query implementation
- [**guidelines.md**](./guidelines.md) - Development guidelines and best practices

## Quick Start

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run the development server:
   ```bash
   pnpm dev
   ```

## Key Principles

- **Simplicity Over Complexity**: Build with precision, implementing exactly what is required
- Next.js App Router with React 19
- Separation of concerns: services → actions → components
- Prefer server components over client components when possible
- Server-only code with 'server-only' imports
- Server actions with 'use server' directives
- Use 'after' from 'next/server' for background tasks
- React Query for ALL client-side data fetching (direct action calls not allowed)
- Formatter functions only used in components
- All server exports must be async functions
- Client services must be implemented as singleton classes

## Additional Notes

- This project uses TailwindCSS for styling
- ESLint is configured to ensure code quality
- TypeScript is used throughout for type safety
- Web3 interactions use viem for Ethereum operations and Coinbase Wallet SDK for wallet connections
