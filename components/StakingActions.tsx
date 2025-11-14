"use client"
import React, { useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from "wagmi"
import { CONTRACT_ADDRESSES } from "@/lib/config"
import StakingRewardABI from "@/lib/contracts/StakingReward.json"
import ERC20ABI from "@/lib/contracts/ERC20.json"
import { maxUint256, parseUnits } from 'viem'

const StakingActions = () => {
    const { address } = useAccount()
    const { writeContract, data: hash, isPending, error } = useWriteContract()
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt()

    const [approveAmount, setApproveAmount] = useState<string>('')
    const [stakingAmount, setStakingAmount] = useState<string>('')
    const [withdrawAmount, setWithdrawAmount] = useState<string>('')

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

    // const { data: tokenInfo } = useReadContracts({
    //     contracts: [
    //         ...(
    //             stakingTokenAddress ? [
    //                 {
    //                     address: stakingTokenAddress,
    //                     abi: ERC20ABI,
    //                     functionName: "decimals"
    //                 },
    //                 {
    //                     address: stakingTokenAddress,
    //                     abi: ERC20ABI,
    //                     functionName: "symbol"
    //                 },
    //             ] : []
    //         ),
    //         ...(
    //             rewardsTokenAddress ? [
    //                 {
    //                     address: rewardsTokenAddress,
    //                     abi: ERC20ABI,
    //                     functionName: "decimals"
    //                 },
    //                 {
    //                     address: rewardsTokenAddress,
    //                     abi: ERC20ABI,
    //                     functionName: "symbol"
    //                 },
    //             ] : []
    //         ),
    //     ],
    // })

    const handleApprove = async () => {
        if (!stakingTokenAddress || !stakingContract || !approveAmount) return
        //TODO: use real token decimals
        const amount = approveAmount == 'max' ? maxUint256 : parseUnits(approveAmount, 18)

        writeContract({
            address: stakingTokenAddress as `0x${string}`,
            abi: ERC20ABI,
            functionName: 'approve',
            args: [stakingContract, amount]
        })
    }
    return (
        <div className='space-y-6'>
            {/* Approve section */}
            <div className='bg-white rounded-lg shadow-lg p-6'>
                <h2 className='text-xl font-bold mb-4'>Approve Staking Token</h2>
                <p className='text-sm text-gray-500 mb-4'>
                    Approve the staking contract to spend your tokens. Use max for unlimitted approval.
                </p>

                <div className='flex gap-2'>
                    <input type="text"
                        value={approveAmount}
                        onChange={(e) => setApproveAmount(e.target.value)}
                        placeholder-shown="Amount or 'max'"
                        className='flex-1 px-4 py-2 border-gray-300 rounded-lg bg-white text-gray-900'
                    />
                    <button className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed '
                        disabled={isPending || isConfirming || !approveAmount}
                        onClick={handleApprove}
                    >
                        {isPending || isConfirming ? "Processing" : "Approve"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StakingActions