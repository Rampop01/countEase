import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { celo, celoAlfajores } from "@reown/appkit/networks";
import { cookieStorage, createStorage } from "wagmi";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "Missing NEXT_PUBLIC_PROJECT_ID. Grab one from https://dashboard.reown.com."
  );
}

export const networks = [celo, celoAlfajores];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
});

const metadata = {
  name: "Lilac Counter",
  description: "A Celo counter powered by Reown AppKit",
  url: "https://example.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886?s=200&v=4"],
};

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  features: {
    analytics: true,
    email: true,
  },
  metadata,
  themeMode: "light",
  themeVariables: {
    "--apkt-accent": "#C8A2C8",
    "--apkt-accent-foreground": "#1a1023",
    "--apkt-background": "#f5ecfb",
  },
});


