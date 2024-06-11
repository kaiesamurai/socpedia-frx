'use client'
import { TOKEN_SUPPORTED } from "@/constant/token";
import { useChainId, useContractRead } from "wagmi";
import AggregatorV3Interface from '../../../contract/out/AggregatorV3Interface.sol/AggregatorV3Interface.json'
import { useEffect, useMemo } from "react";

export default function RoundId({tokenAddress, setRoundId}:{tokenAddress: string, setRoundId:any}) {
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

  useEffect(() => {
    if(price && price[0] !== null) {
      setRoundId(price[0].toString())
    }
  }, [price])

  return (
    <div>
    </div>
  )
}
