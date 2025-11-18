'use client'

import { useAccount } from 'wagmi'
import { WalletConnect } from '@/components/WalletConnect'
import { StakingStats } from '@/components/StakingStats'
import { StakingActions } from '@/components/StakingActions'
import { CONTRACT_ADDRESSES } from '@/lib/config'

export default function Home() {
  const { isConnected } = useAccount()

  if (!CONTRACT_ADDRESSES.STAKING_REWARD) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Configuration Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please set the <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS
            </code> environment variable with your deployed contract address.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            You can also update it directly in <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              lib/config.ts
            </code>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Staking Rewards
            </h1>
            <WalletConnect />
          </div>
          {!isConnected && (
            <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 text-blue-700 dark:text-blue-300 px-4 py-3 rounded">
              Please connect your wallet to interact with the staking contract.
            </div>
          )}
        </header>

        {isConnected && (
          <>
            <StakingStats />
            <StakingActions />
          </>
        )}
      </div>
    </div>
  )
}
