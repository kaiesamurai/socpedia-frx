'use client'
import { TOKEN_SUPPORTED } from "@/constant/token";
import { useChainId, useContractRead } from "wagmi";
import AggregatorV3Interface from '../../../contract/out/AggregatorV3Interface.sol/AggregatorV3Interface.json'
import { useMemo } from "react";

export default function DataFeed({tokenAddress}:{tokenAddress: string}) {
  const chain = useChainId()
  const { data: price } = useContractRead({
    address: TOKEN_SUPPORTED[chain][tokenAddress]
      .dataFeed as `0x${string}`,
    abi: AggregatorV3Interface.abi as any,
    functionName: 'latestRoundData',
  });

  const tokenPrice = useMemo(
    () => (price && price[1] !== null ? Number(price[1]) / 10 ** 8 : 0),
    [price]
  );

  return (
    <div className="flex gap-2 items-center">
      <img src={TOKEN_SUPPORTED[chain][tokenAddress].image} className="w-7 h-7" />
      {tokenPrice} USD
    </div>
  )
}
