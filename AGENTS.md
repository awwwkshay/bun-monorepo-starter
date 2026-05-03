# Agent Context & Instructions: Bun Monorepo

This document provides essential context and instructions for AI agents working in this monorepo. Adhere to these guidelines to ensure consistency, performance, and correctness.

## 1. Project Overview & Architecture

This is a modern monorepo managed with **Bun**, designed for high-performance development and production environments. It follows a workspace-based structure.

- **Root**: Workspace management, shared configuration, and root-level orchestration.
- **`apps/web`**: **TanStack Start** application (React 19, Vite, Tailwind v4, TanStack Router). Primary user-facing frontend.
- **`apps/api`**: Bun-native API service using **Hono** and **OpenAPI** (via `@hono/zod-openapi`). Features Scalar for documentation.
- **`apps/cli`**: Bun-native command-line interface tool using **React** and **OpenTUI**.
- **`packages/core`**: Shared business logic, database schemas (**Drizzle ORM**), and common utilities. Uses PostgreSQL via `pg`.

## 2. Environment & Tooling

- **Runtime**: Always use **Bun** (`bun`) instead of Node.js.
- **Package Manager**: Use `bun install` for dependency management.
- **Testing**:
  - `apps/web`: Uses **Vitest** for frontend-specific testing (React components, hooks).
  - Others: Use **Bun Test** (`bun test`) for general TypeScript/JavaScript tests.
- **Bundler**: `apps/web` uses **Vite**; other packages leverage Bun's native bundling capabilities.
- **Routing**: **TanStack Router** handles type-safe routing in the web app.

## 3. Essential Commands

### General (Workspace Root)

- **Install**: `bun install`
- **Run all tests**: `bun test` (runs both Bun Test and Vitest via workspace scripts)
- **Type check**: `bun x tsc --noEmit`
- **Clean start**: `bun install && bun x tsc --noEmit`

### Web Application (`apps/web`)

- **Dev**: `bun run dev` (starts Vite on port 3000)
- **Build**: `bun run build` (outputs to `dist/`)
- **Test All**: `bun run test` (Vitest)
- **Run Single Test**: `bun x vitest run <path/to/test>`
- **Watch Single Test**: `bun x vitest <path/to/test>`

### API Service (`apps/api`)

- **Dev**: `bun run dev` (starts server with hot reload)
- **Build**: `bun run build` (outputs to `dist/`)
- **Test All**: `bun test`
- **Run Single Test**: `bun test <path/to/test>`

### Shared Packages & CLI

- **CLI Dev**: `bun run dev --filter cli`
- **Core Build**: `bun run build --filter @bun-monorepo/core`
- **Database Studio**: `bun run db:studio --filter @bun-monorepo/core`
- **Database Sync**: `bun run db:sync --filter @bun-monorepo/core`
- **Migrations**: `bun run migrations:generate` and `bun run migrations:up` in `packages/core`.

## 4. Code Style & Conventions

### General TS/JS

- **Semicolons**: **NEVER** use semicolons. (e.g., `const x = 1` not `const x = 1;`)
- **Quotes**: Single quotes (`'`) for strings, except when double quotes are necessary (e.g., JSX `className="foo"`, JSON).
- **Indentation**: 2 spaces.
- **Naming**:
  - **React Components**: PascalCase (e.g., `UserProfile.tsx`).
  - **Functions/Variables**: camelCase (e.g., `getUserData`).
  - **Types/Interfaces**: PascalCase (e.g., `UserResponse`).
  - **Files**: camelCase for logic, PascalCase for components.
- **Types**:
  - Prefer `type` over `interface` for consistency.
  - Avoid `any`. Use `unknown` if a type is truly unknown.
  - Use Bun's built-in types (e.g., `Bun.FileBlob`).

### React & Frontend (`apps/web`, `apps/cli`)

- **Components**: Use functional components with `export default function ComponentName()`.
- **Hooks**: Standard React hooks and TanStack hooks.
- **Styling**:
  - Use **Tailwind CSS v4** (utility-first).
  - Use visual tokens from `styles.css`.
  - Prefer CSS variables (e.g., `var(--sea-ink)`) and `color-mix`.
- **Imports**:
  - Use absolute imports via `#/*` or `@/*` aliases (refer to `tsconfig.json`).
  - Order: React/Libraries -> Workspace Packages -> Internal Modules.
  - No file extensions in imports (except for assets).

### Bun-Native Logic (`apps/api`, `packages/core`)

- **Server**: Use `Bun.serve()` with **Hono**.
- **File System**: Use `Bun.file()` and `Bun.write()` for better performance.
- **Database**: Use **Drizzle ORM** with `pg` (PostgreSQL).
- **Validation**: Use **Zod** for schema validation and Open API documentation.
- **Shell**: Use `Bun.$` for shell operations.

## 5. Workflows & Patterns

### Adding a New Route (`apps/web`)

1. Create a new `.tsx` file in `apps/web/src/routes`.
2. Use `createFileRoute` from `@tanstack/react-router`.
3. The route tree is typically auto-generated (check `routeTree.gen.ts`).

### Adding Dependencies

- To add to a specific app: `bun add <package> --filter <app-name>`
- To add as a dev dependency: `bun add -d <package> --filter <app-name>`
- To add shared package: `bun add @bun-monorepo/core --filter web` (example)

### Error Handling

- **Async Ops**: Always wrap in `try...catch` blocks.
- **API Errors**: Use Hono's `app.onError` or return structured Zod errors.
- **UI Errors**: Use TanStack Router's error components or boundaries.
- **Logging**: Provide clear context in error messages.
- **Secrets**: NEVER hardcode or log secrets. Bun automatically loads `.env`.
- **Sanitization**: Always sanitize user inputs, especially for shell or DB operations.

## 6. Core Mandates

1. **Bun First**: Default to Bun built-ins (`Bun.serve`, `Bun.sql` etc.) over Node-specific equivalents.
2. **Absolute Paths**: Always use absolute paths when interacting with the file system through tools.
3. **Consistency**: Maintain existing patterns (no semicolons, PascalCase components).
4. **No Vite for Pure Bun**: In non-`web` apps, use `Bun.serve()` if a backend is needed, avoiding Vite.

## 7. External Tool Integration

- **Cursor Rules**: No project-specific `.cursorrules` or `.cursor/rules/*.mdc` files found. Follow the mandates in this file.
- **Copilot Rules**: No project-specific `.github/copilot-instructions.md` found. Follow the mandates in this file.

---

_Created on: Fri Apr 03 2026. Updated for comprehensive agent guidance._
