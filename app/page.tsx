"use client"
import { WalletConnect } from "@/components/WalletConnect";
import { useAccount } from "wagmi";
import { CONTRACT_ADDRESSES } from "@/lib/config";
import { StakingStats } from "@/components/StakingStats";
import StakingActions from "@/components/StakingActions";

export default function Home() {

  const { isConnected } = useAccount()
  if (!CONTRACT_ADDRESSES.STAKING_REWARD) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Configuration Required</h1>
          <p className="text-gray-600 mb-4">
            Please set the <code className="bg-gray-100 px-2 py-1 rounded ">NEXT_PUBLIC_STAKING_REWARD_CONTRACT_ADDRESSES  </code> environment variable with your deployed contract address
          </p>
          <p className="text-gray-600 mb-4">
            You can update it directly in  <code className="bg-gray-100 px-2 py-1 rounded ">lib/config.ts </code>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className=" min-h-screen bg-gray-50">

      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-600">
              Staking Rewards
            </h1>
            <WalletConnect />

          </div>
          {
            !isConnected && (
              <div className="bg-blue-100 border-blue-400 text-blue-700 py-3 rounded border px-4">
                Please Connect your Wallet to interact with the staking contract
              </div>
            )
          }
        </header>

        {
          isConnected && (
            <>
              <StakingStats />
              <StakingActions />
            </>
          )
        }
      </div>
    </div>
  );
}
