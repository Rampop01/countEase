## Overview

Lilac-themed Celo counter dapp that uses [Reown AppKit](https://docs.reown.com/appkit) +
`wagmi` to connect wallets on Celo Mainnet and Alfajores. The UI lives under `app/page.tsx`
and is wrapped in `AppKitProvider` for SSR-friendly setup.

## Requirements

- Node 18+
- Reown `projectId` (create one at [dashboard.reown.com](https://dashboard.reown.com))
- Deployed `Counter` contract address on Celo or Alfajores

Create a `.env.local` in this folder:

```
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id
NEXT_PUBLIC_COUNTER_ADDRESS=0x...
```

## Getting Started

Install deps then run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` – start Next.js in dev mode
- `npm run build` – production build
- `npm run start` – run the built app
- `npm run lint` – run eslint

## Contract Interaction

The UI reads and writes against the `Counter` contract using the ABI in `lib/abi/counter.ts`.
The lilac dashboard exposes:

1. Live counter display (polls via `useReadContract`)
2. Increment button
3. Arbitrary `setNumber` input

Wallet connection, network switching, and theming come from AppKit, preconfigured with lilac
`themeVariables` in `lib/appkit.ts`.
