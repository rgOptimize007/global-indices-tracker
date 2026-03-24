# Global Indices Tracker

A micro-frontend dashboard for global market indices built with **React + Vite + Module Federation**. The repository is organized as an npm workspace with one host shell (`container`) and index-specific remote apps (`mfe-nifty`, `mfe-nasdaq`).

## Architecture overview

### Shell (`apps/container`)
The container is the host app. It is responsible for:
- shared page layout and navigation
- rendering remote boundaries (loading + error fallback)
- composing federated remotes into one dashboard
- avoiding index-specific business logic/data ownership

### Remotes (`apps/mfe-*`)
Each remote is responsible for:
- fetching/producing its own market snapshot
- rendering the index card UI for that market
- exposing `./MarketCard` via Module Federation
- running independently for local development and preview

In short: **the shell orchestrates composition, remotes own market behavior and data fetching**.

---

## Workspace and package manager

This monorepo uses:
- **npm workspaces** (declared in root `package.json` as `"workspaces": ["apps/*"]`)
- **npm + package-lock.json** as the package manager/lockfile choice

### Install dependencies

From the repository root:

```bash
npm install
```

---

## Local development

### Ports

| App | Workspace package | Dev port | Preview port |
|---|---|---:|---:|
| Host shell | `@global-indices/container` | `3000` | `3000` |
| NIFTY remote | `@global-indices/mfe-nifty` | `3001` | `3001` |
| NASDAQ remote | `@global-indices/mfe-nasdaq` | `3002` | `3002` |

The host is configured to load remote entries from:
- `http://localhost:3001/assets/remoteEntry.js`
- `http://localhost:3002/assets/remoteEntry.js`

### Run everything together

```bash
npm run dev
```

This starts all workspace dev servers concurrently via workspace scripts.

### Run the host container only

```bash
npm run dev:container
```

### Run each micro-frontend only

```bash
npm run dev:mfe-nifty
npm run dev:mfe-nasdaq
```

> For end-to-end shell composition, the shell and required remotes must be running at the same time.

---

## Build and preview

### Build all workspaces

```bash
npm run build
```

### Build a specific app

```bash
npm run build:container
npm run build:mfe-nifty
npm run build:mfe-nasdaq
```

### Preview production build(s)

```bash
npm run start:container
npm run start:mfe-nifty
npm run start:mfe-nasdaq
```

---

## Current mock-data approach

At the moment, each remote owns a local mock market-data module (`src/marketData.ts`) that:
- exports a static `MarketSnapshot`
- simulates network latency with `setTimeout`
- intentionally throws an error sometimes (random failure) to exercise retry/error UI states

This keeps development deterministic enough for UI work while still validating loading/error handling in each remote and in the shell boundary behavior.

---

## Add a new index/region micro-frontend (pattern)

Follow this established pattern used by `mfe-nifty` and `mfe-nasdaq`.

### 1) Create a new workspace app

Create a new folder under `apps/`, for example `apps/mfe-ftse`, with:
- `package.json`
- `vite.config.ts`
- `index.html`
- `tsconfig.json`
- `src/main.tsx`
- `src/MarketCard.tsx`
- `src/marketData.ts`
- `src/styles.css`

Use an existing remote as a template to stay consistent.

### 2) Configure Module Federation in the new remote

In the new remote’s `vite.config.ts`:
- set a unique federation `name` (example: `mfe_ftse`)
- set `filename: 'remoteEntry.js'`
- expose the index card as `./MarketCard`
- share `react` and `react-dom`

Also choose a unique local port in that app’s `dev` and `start` scripts.

### 3) Implement remote-local data and card UI

Inside the remote:
- define your mock snapshot in `src/marketData.ts`
- fetch/load it in `src/MarketCard.tsx`
- preserve loading/error/success states
- keep this logic remote-owned (do not move into shell)

### 4) Register the remote in the host shell

Update `apps/container/vite.config.ts`:
- add a new remote key and `remoteEntry.js` URL under `federation.remotes`

Example shape:

```ts
remotes: {
  mfe_nifty: 'http://localhost:3001/assets/remoteEntry.js',
  mfe_nasdaq: 'http://localhost:3002/assets/remoteEntry.js',
  mfe_ftse: 'http://localhost:3003/assets/remoteEntry.js'
}
```

### 5) Render the remote in `apps/container/src/App.tsx`

- add a `lazy(() => import('mfe_ftse/MarketCard'))`
- wrap it in existing `ErrorBoundary` + `Suspense` + `RemoteCardShell`
- place it in the dashboard grid alongside the other remotes
- optionally update shell-level summary metrics if desired

### 6) Add convenient root scripts

In the root `package.json`, add scripts matching existing naming style:
- `dev:mfe-ftse`
- `start:mfe-ftse`
- `build:mfe-ftse`

### 7) Verify locally

Run:

```bash
npm run dev:mfe-ftse
npm run dev:container
```

Then open `http://localhost:3000` and confirm the new card loads through federation and handles loading/error states properly.
