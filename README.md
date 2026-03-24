# Global Indices Tracker

Global Indices Tracker is a **micro-frontend dashboard** built with **React + Vite + Module Federation**. It uses one host shell (`container`) that composes index-specific remote apps (`mfe-nifty`, `mfe-nasdaq`).

## Architecture overview

### Shell (`apps/container`)
The shell is the host application. Its responsibilities are to:
- provide shared layout, navigation, and page structure
- define remote loading boundaries (loading and error UX)
- compose multiple remotes into a single dashboard view
- avoid owning index-specific market logic or data fetching

### Remotes (`apps/mfe-*`)
Each remote is an independently runnable micro-frontend. Its responsibilities are to:
- own index-specific market data loading/mock behavior
- render index UI (`MarketCard`) and related local styles
- expose `./MarketCard` via Module Federation
- remain independently buildable and previewable

In short: **the shell handles composition; remotes handle domain behavior and data.**

---

## Workspace and package manager

- Monorepo workspace model: **npm workspaces**
- Workspace declaration: root `package.json` → `"workspaces": ["apps/*"]`
- Package manager and lockfile: **npm** + `package-lock.json`

## Install dependencies

From the repository root:

```bash
npm install
```

---

## Run the apps locally

## Ports used

| App | Package | Dev port | Preview port |
|---|---|---:|---:|
| Host shell | `@global-indices/container` | `3000` | `3000` |
| NIFTY remote | `@global-indices/mfe-nifty` | `3001` | `3001` |
| NASDAQ remote | `@global-indices/mfe-nasdaq` | `3002` | `3002` |

The shell resolves remotes at:
- `http://localhost:3001/assets/remoteEntry.js`
- `http://localhost:3002/assets/remoteEntry.js`

### Run all workspaces at once

```bash
npm run dev
```

### Run only the host shell (`container`)

```bash
npm run dev:container
```

### Run each micro-frontend individually

```bash
npm run dev:mfe-nifty
npm run dev:mfe-nasdaq
```

> For full composition in the shell UI, start `container` and any remotes it imports.

---

## Build commands

### Build everything

```bash
npm run build
```

### Build each app individually

```bash
npm run build:container
npm run build:mfe-nifty
npm run build:mfe-nasdaq
```

### Preview production builds

```bash
npm run start:container
npm run start:mfe-nifty
npm run start:mfe-nasdaq
```

---

## Current mock-data approach

Mock market data is currently implemented **inside each remote**, not in the shell:

- `apps/mfe-nifty/src/marketData.ts`
- `apps/mfe-nasdaq/src/marketData.ts`

Current behavior pattern:
- returns a static `MarketSnapshot`
- simulates request latency with `setTimeout`
- randomly throws errors (`Math.random() < 0.15`) to exercise retry/fallback UX

This intentionally validates both:
- remote-local loading/error/success state handling
- shell-level federation boundary resilience (Suspense + ErrorBoundary)

---

## Add a new index/region micro-frontend

Use existing remotes (`mfe-nifty`, `mfe-nasdaq`) as the template pattern.

### 1) Create a new workspace app

Create a new folder under `apps/`, for example `apps/mfe-ftse`, with:
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `index.html`
- `src/main.tsx`
- `src/MarketCard.tsx`
- `src/marketData.ts`
- `src/styles.css`

### 2) Configure remote federation in the new app

In `apps/mfe-ftse/vite.config.ts`:
- set a unique federation `name` (for example `mfe_ftse`)
- set `filename: 'remoteEntry.js'`
- expose `./MarketCard`
- share `react` and `react-dom`

Also use a unique local port in the new app’s scripts (for example 3003).

### 3) Implement remote-owned market behavior

Inside the new remote:
- define the snapshot/mock loader in `src/marketData.ts`
- render index UI in `src/MarketCard.tsx`
- keep loading/error/success states within the remote boundary

### 4) Register the remote in the shell

Update `apps/container/vite.config.ts` with a new entry in `federation.remotes`, e.g.:

```ts
remotes: {
  mfe_nifty: 'http://localhost:3001/assets/remoteEntry.js',
  mfe_nasdaq: 'http://localhost:3002/assets/remoteEntry.js',
  mfe_ftse: 'http://localhost:3003/assets/remoteEntry.js'
}
```

### 5) Render the new remote card in the shell UI

Update `apps/container/src/App.tsx` to:
- add `lazy(() => import('mfe_ftse/MarketCard'))`
- wrap it in the same `ErrorBoundary` + `Suspense` + `RemoteCardShell` pattern
- place it in the dashboard grid with other remotes

### 6) Add root scripts for convenience

In root `package.json`, add matching scripts:
- `dev:mfe-ftse`
- `start:mfe-ftse`
- `build:mfe-ftse`

### 7) Verify locally

```bash
npm run dev:mfe-ftse
npm run dev:container
```

Then open `http://localhost:3000` and confirm the new remote loads and handles loading/error states correctly.
