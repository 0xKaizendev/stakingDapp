"use client"
import { CONTRACT_ADDRESSES } from "@/lib/config"
import { useAccount, useReadContracts, useReadContract } from "wagmi"
import StakingRewardABI from "@/lib/contracts/StakingReward.json"
import ERC20ABI from "@/lib/contracts/ERC20.json"
import { useEffect, useState } from "react"
import { formatUnits } from "viem"


export function StakingStats() {

    const { address } = useAccount()
    const [stakingTokenDecimals, setStakingTokenDecimals] = useState<number>(18)
    const [rewardsTokenDecimals, setRewardsTokenDecimals] = useState<number>(18)
    const [rewardsTokenSmbol, setRewardsTokenSymbol] = useState<string>('')
    const [stakingTokenSmbol, setStakingTokenSymbol] = useState<string>('')

    const stakingContract = CONTRACT_ADDRESSES.STAKING_REWARD as `0x${string}`

    const { data: tokenAddresses } = useReadContracts({
        contracts: [
            {
                address: stakingContract,
                abi: StakingRewardABI,
                functionName: "stakingToken"
            },
            {
                address: stakingContract,
                abi: StakingRewardABI,
                functionName: "rewardsToken"
            },
        ],
    })

    const stakingTokenAddress = tokenAddresses?.[0].result as `0x${string}` || undefined
    const rewardsTokenAddress = tokenAddresses?.[1].result as `0x${string}` || undefined

    const { data: tokenInfo } = useReadContracts({
        contracts: [
            ...(
                stakingTokenAddress ? [
                    {
                        address: stakingTokenAddress,
                        abi: ERC20ABI,
                        functionName: "decimals"
                    },
                    {
                        address: stakingTokenAddress,
                        abi: ERC20ABI,
                        functionName: "symbol"
                    },
                ] : []
            ),
            ...(
                rewardsTokenAddress ? [
                    {
                        address: rewardsTokenAddress,
                        abi: ERC20ABI,
                        functionName: "decimals"
                    },
                    {
                        address: rewardsTokenAddress,
                        abi: ERC20ABI,
                        functionName: "symbol"
                    },
                ] : []
            ),
        ],
    })

    useEffect(() => {
        if (tokenInfo && stakingTokenAddress && rewardsTokenAddress) {
            const stakingDec = tokenInfo[0].result as number || undefined
            const stakingSymb = tokenInfo[1].result as string || undefined
            const rewardsgDec = tokenInfo[2].result as number || undefined
            const rewardsSymb = tokenInfo[3].result as string || undefined

            if (stakingDec !== undefined) setStakingTokenDecimals(stakingDec)
            if (stakingSymb !== undefined) setStakingTokenSymbol(stakingSymb)
            if (rewardsgDec !== undefined) setRewardsTokenDecimals(rewardsgDec)
            if (rewardsSymb !== undefined) setRewardsTokenSymbol(rewardsSymb)
        }
    }, [tokenInfo, stakingTokenAddress, rewardsTokenAddress])

    const { data: userBalance } = useReadContract({
        address: stakingContract,
        abi: StakingRewardABI,
        functionName: "balances",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && !!stakingContract
        }
    })

    const { data: earnedRewards } = useReadContract({
        address: stakingContract,
        abi: StakingRewardABI,
        functionName: "earned",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && !!stakingContract,
            refetchInterval: 5000
        }
    })
    const { data: totalSpply } = useReadContract({
        address: stakingContract,
        abi: StakingRewardABI,
        functionName: "totalSupply",
        query: {
            enabled: !!address && !!stakingContract,
        }
    })

    const { data: rewardInfo } = useReadContracts({
        contracts: [
            {
                address: stakingContract,
                abi: StakingRewardABI,
                functionName: "rewardRate"
            },
            {
                address: stakingContract,
                abi: StakingRewardABI,
                functionName: "periodFinish"
            },
            {
                address: stakingContract,
                abi: StakingRewardABI,
                functionName: "rewardsDuration"
            },
        ],
        query: {
            enabled: !!address && !!stakingContract,
        }
    })

    const rewardRate = rewardInfo?.[0].result as bigint | undefined
    const periodFinish = rewardInfo?.[0].result as bigint | undefined
    const rewardsDuration = rewardInfo?.[0].result as bigint | undefined

    const { data: walletBalance } = useReadContract({
        address: stakingTokenAddress,
        abi: ERC20ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && !!stakingContract,
        }
    })

    const formatTokenAmount = (amount: bigint | undefined, decimals: number) => {
        if (!amount) return '0.00'
        return parseFloat(formatUnits(amount, decimals)).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        })
    }

    const formatTimeRemaining = (finish: bigint | undefined) => {
        if (!finish) return 'N/A'
        const now = BigInt(Math.floor(Date.now() / 1000))
        if (finish <= now) return 'Ended'
        const remaining = Number(finish - now)
        const days = Math.floor(remaining / 86400)
        const hours = Math.floor((remaining % 86400) / 3600)
        const minutes = Math.floor((remaining % 3600) / 60)
        if (days > 0) return `${days}d ${hours}h`
        if (hours > 0) return `${hours}h ${minutes}m`
        return `${minutes}m`
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-sm font-medium text-gray-500 mb-2">
                    Your Staked Balance
                </h1>
                <p>
                    {formatTokenAmount(userBalance as bigint | undefined, stakingTokenDecimals)} {stakingTokenSmbol}
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-sm font-medium text-gray-500 mb-2">
                    Pending Rewards
                </h1>
                <p>
                    {formatTokenAmount(earnedRewards as bigint | undefined, rewardsTokenDecimals)} {rewardsTokenSmbol}
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-sm font-medium text-gray-500 mb-2">
                    Wallet Balance
                </h1>
                <p>
                    {formatTokenAmount(walletBalance as bigint | undefined, stakingTokenDecimals)} {stakingTokenSmbol}
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-sm font-medium text-gray-500 mb-2">
                    Total Staked
                </h1>
                <p>
                    {formatTokenAmount(totalSpply as bigint | undefined, stakingTokenDecimals)} {stakingTokenSmbol}
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-sm font-medium text-gray-500 mb-2">
                    Reward Rate
                </h1>
                <p>
                    {
                        rewardRate ? `${formatTokenAmount(rewardRate as bigint | undefined, rewardsTokenDecimals)} ${rewardsTokenSmbol}/sec` : "N/A"
                    }
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-sm font-medium text-gray-500 mb-2">
                    Time Remaining
                </h1>
                <p>
                    {
                        formatTimeRemaining(periodFinish)
                    }
                </p>
            </div>
        </div>
    )
}