# Mandi Saathi

A simple, mobile-first web app for a vegetable **mandi commission agent**. Built for fast manual data entry by a munim with minimal training.

Version 1 has **no backend and no database** — all data is served from local JSON datasets through a repository pattern, so the UI is completely decoupled from the data source. When the Node.js + PostgreSQL backend is ready, flip one config value and the app talks to the API with **no page-code changes**.

## Tech Stack

- React + TypeScript
- Vite
- TailwindCSS
- React Router

## Getting Started

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build
npm run lint     # lint
```

## Features (Version 1)

- **Home** — large touch-friendly cards: New Sale, New Farmer, Farmers, Commodities, Reports.
- **Farmer Master** — add / edit / search / view. Multi-select "Commodities Dealt In". Auto-generated Farmer ID, status Active/Inactive.
- **Commodity Master** — add / edit / search. Can also be created inline from anywhere via the commodity dropdown.
- **Grade Master** — grades belong to commodities, grouped by commodity. Can be created inline from any screen.
- **Sale Entry** — the core screen. Auto sale number, farmer/commodity/grade selectors, **dynamic trader** (typed name is matched or created automatically), optional quantity/unit/weight, rate and commission %. Live calculation of Gross / Commission / Net while typing.
- **Reports** — Daily, Farmer-wise, Commodity-wise, and Commission reports, all filterable by date range.

No charts, no analytics, no inventory, no notifications, no auth — by design.

## Architecture

The UI never touches JSON files. Data flows strictly through layers:

```
Page  →  Service  →  RepositoryFactory  →  Repository (Mock | Api)  →  data source
```

```
src/
  components/      Reusable UI (nav, modal, selects with inline-create, etc.)
  pages/           Screen-level components
  types/           TypeScript models: Farmer, Commodity, Grade, Trader, Sale
  services/        Business logic the pages talk to (the only thing pages import)
  repositories/    Repository interfaces + Mock and Api implementations
  factory/         RepositoryFactory — picks the implementation from config
  hooks/           Master-data context/provider + useMasters hook
  mocks/           Sample JSON datasets (imported ONLY by mock repositories)
```

### Switching the data source

`src/config.ts` holds the single switch:

```ts
export const DATA_PROVIDER = 'mock' // 'mock' today, 'api' later
```

You can also set it via env vars without touching code:

```
VITE_DATA_PROVIDER=api
VITE_API_BASE_URL=https://your-backend/api
```

`RepositoryFactory` reads this value and returns either the `Mock*` or `Api*`
repository. Pages and services are unaware of which one is in use.

### Connecting a future backend

The `Api*` repositories already implement the repository interfaces against a
REST convention (`GET /farmers`, `POST /farmers`, `PATCH /farmers/:id`,
`DELETE /farmers/:id`, `GET /grades?commodityId=...`, `GET /traders/search?name=...`).
Point `VITE_API_BASE_URL` at your server, set `DATA_PROVIDER=api`, and you're done.

### Mock persistence

The mock repositories seed from the JSON files on first run and then mirror
writes to `localStorage`, so data entered during a session survives reloads.
Clear the `mandi:*` localStorage keys to reset to the seed data.
