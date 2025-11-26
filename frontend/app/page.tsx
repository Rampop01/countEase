"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { COUNTER_ABI } from "@/lib/abi/counter";

const counterAddress = process.env
  .NEXT_PUBLIC_COUNTER_ADDRESS as `0x${string}` | undefined;

export default function Home() {
  const { isConnected, address } = useAccount();
  const [newValue, setNewValue] = useState("");

  const {
    data: count,
    isPending: isReading,
    refetch,
    error: readError,
  } = useReadContract({
    address: counterAddress,
    abi: COUNTER_ABI,
    functionName: "number",
    query: { enabled: Boolean(counterAddress) },
  });

  const {
    writeContract,
    data: hash,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      refetch();
    }
  }, [isConfirmed, refetch]);

  const statusMessage = useMemo(() => {
    if (!counterAddress) {
      return "Set NEXT_PUBLIC_COUNTER_ADDRESS to interact with the contract.";
    }
    if (!isConnected) {
      return "Connect a wallet to read and update the counter.";
    }
    if (isReading) {
      return "Fetching counter value...";
    }
    if (isWriting || isConfirming) {
      return "Waiting for your transaction to confirm...";
    }
    if (readError) {
      return readError.message;
    }
    if (writeError) {
      return writeError.message;
    }
    if (isConfirmed) {
      return "Counter updated!";
    }
    return "Ready to interact.";
  }, [
    isConnected,
    isReading,
    isWriting,
    isConfirming,
    readError,
    writeError,
    isConfirmed,
  ]);

  const displayCount = count ? count.toString() : "–";
  const disableActions =
    !isConnected || !counterAddress || isWriting || isConfirming;

  const handleIncrement = () =>
    writeContract({
      address: counterAddress,
      abi: COUNTER_ABI,
      functionName: "increment",
    });

  const handleSetNumber = () => {
    if (!newValue) return;
    writeContract({
      address: counterAddress,
      abi: COUNTER_ABI,
      functionName: "setNumber",
      args: [BigInt(newValue)],
    });
    setNewValue("");
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10 text-foreground">
      <header className="flex flex-col gap-4 rounded-3xl bg-white/60 p-6 shadow-xl shadow-[rgba(200,162,200,0.45)] backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-lime-900/70">
            Celo Counter
          </p>
          <h1 className="text-4xl font-semibold text-foreground">
            Lilac control center
          </h1>
          <p className="mt-2 max-w-2xl text-base text-foreground/70">
            Connect any wallet through Reown AppKit, view the current counter,
            and send transactions on Celo or Alfajores with a single tap.
          </p>
        </div>
        <appkit-button />
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <article className="col-span-2 rounded-3xl border border-white/50 bg-white/70 p-6 shadow-2xl shadow-[rgba(200,162,200,0.55)] backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Live value</p>
              <h2 className="text-6xl font-semibold tracking-tight text-foreground">
                {displayCount}
              </h2>
            </div>
            <div className="rounded-full bg-[#C8A2C8]/20 px-4 py-2 text-sm font-medium text-[#4b2a58]">
              {isConnected ? "Connected" : "Disconnected"}
            </div>
          </div>
          <p className="mt-6 text-sm text-foreground/65">{statusMessage}</p>
          {address && (
            <p className="mt-1 text-xs text-foreground/40">
              Active wallet: {address.slice(0, 6)}…{address.slice(-4)}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleIncrement}
              disabled={disableActions}
              className="rounded-2xl bg-[#c8a2c8] px-6 py-3 text-base font-semibold text-[#1f0d29] transition hover:bg-[#b793b7] disabled:cursor-not-allowed disabled:opacity-60"
            >
              + Increment
            </button>
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-dashed border-[#c8a2c8]/60 bg-white/60 px-4 py-3">
              <input
                type="number"
                min="0"
                value={newValue}
                onChange={(event) => setNewValue(event.target.value)}
                placeholder="Set to…"
                className="w-full bg-transparent text-base text-foreground placeholder:text-foreground/40 focus:outline-none"
              />
              <button
                onClick={handleSetNumber}
                disabled={disableActions || !newValue}
                className="rounded-xl bg-[#f0dbff] px-4 py-2 text-sm font-semibold text-[#3d1a4b] transition hover:bg-[#e9ccff] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Update
              </button>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-white/40 bg-[#2e1a3a] p-6 text-white shadow-xl">
          <h3 className="text-lg font-semibold">How it works</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li>1. Connect a wallet via the AppKit button.</li>
            <li>2. Choose Celo Mainnet or Alfajores inside the modal.</li>
            <li>3. Use the actions to increment or set the on-chain value.</li>
            <li>4. Status updates stream in as transactions confirm.</li>
          </ul>
          <div className="mt-6 rounded-2xl bg-white/10 p-4 text-xs leading-relaxed text-white/70">
            Need to change networks? Reopen the AppKit modal at any time—
            lilac theme keeps the experience on-brand.
          </div>
        </article>
      </section>
    </main>
  );
}
