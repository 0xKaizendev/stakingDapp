import { createConfig, http } from 'wagmi'
import { sepolia, localhost } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// You'll need to set these environment variables
// For WalletConnect, get a project ID from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

export const config = createConfig({
  chains: [sepolia, localhost],
  connectors: [
    injected(),
    metaMask(),
    ...(projectId ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    // [mainnet.id]: http(),
    [sepolia.id]: http(),
    [localhost.id]: http(),
  },
})

// Contract addresses - update these with your deployed contract addresses
export const CONTRACT_ADDRESSES = {
  // Example: '0x1234567890123456789012345678901234567890'
  // Update this with your actual contract address
  STAKING_REWARD: process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS || '',
}

export type ContractAddresses = typeof CONTRACT_ADDRESSES

