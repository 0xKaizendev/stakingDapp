import { createConfig, http } from "wagmi"
import { sepolia } from "wagmi/chains"
import { injected, metaMask, walletConnect } from "wagmi/connectors"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ""

export const config = createConfig({
    chains: [sepolia],
    connectors: [
        injected(),
        metaMask(),
        ...(projectId ? [walletConnect({ projectId })] : []),
    ],
    transports: {
        [sepolia.id]: http()
    }
})

export const CONTRACT_ADDRESSES = {
    STAKING_REWARD: process.env.NEXT_PUBLIC_STAKING_REWARD_CONTRACT_ADDRESSES
}

export type ContractAddresses = typeof CONTRACT_ADDRESSES