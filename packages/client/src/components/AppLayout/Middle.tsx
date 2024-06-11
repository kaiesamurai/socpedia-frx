import { useContractRead } from "wagmi";

import NewFeed from "../NewFeed";
import Zip from "../zip";
import FactbookAbi from '../../../../contract/out/Factbook.sol/Factbook.json'
import FactbookAddress from '../../../../contract/contractInfo.json'

export default function Middle() {
  // Read token
  // eslint-disable-next-line
  // @ts-ignore
  const { data: count, isError, isSuccess } = useContractRead({
    // eslint-disable-next-line
    // @ts-ignore
    address: FactbookAddress.deployedTo as `0x${string}`,
    abi: FactbookAbi.abi as any,
    functionName: 'count',
  })

  return (
    <div className="border-r-2 border-base-300 p-4 min-h-screen">
      <Zip />
      <div className="divider"/>
      { isSuccess &&
        <NewFeed count={Number(count)}/>
      }
    </div>
  )
}