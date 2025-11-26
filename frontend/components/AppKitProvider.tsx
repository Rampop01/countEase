"use client";

import { ReactNode, useMemo } from "react";
import {
  cookieToInitialState,
  WagmiProvider,
  type Config as WagmiConfig,
} from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { appKit, wagmiAdapter } from "@/lib/appkit";

const queryClient = new QueryClient();
const wagmiConfig = wagmiAdapter.wagmiConfig as WagmiConfig;

type AppKitProviderProps = {
  children: ReactNode;
  cookies: string | null;
};

export function AppKitProvider({ children, cookies }: AppKitProviderProps) {
  const initialState = useMemo(
    () => cookieToInitialState(wagmiConfig, cookies),
    [cookies]
  );

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export { appKit };


