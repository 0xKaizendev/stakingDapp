"use client"
import { useAccount, useConnect, useDisconnect } from "wagmi"

export function WalletConnect() {
    const { address, isConnected } = useAccount()
    const { connect, connectors } = useConnect()
    const { disconnect } = useDisconnect()

    if (isConnected) {
        return (
            <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                    {address?.slice(0, 6)}... {address?.slice(-4)}
                </div>

                <button onClick={() => disconnect()} className=" px-6 py-3 bg-red-600 hover:bg-red-600 text-white transition-colors rounded-lg">
                    Disconnect
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            {
                connectors.map((connector) => (
                    <button key={connector.uid} onClick={() => connect({ connector })} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ">

                        Connect with {connector.name}
                    </button>
                ))
            }
        </div>
    )
}