import axios from 'axios';
import { useEffect, useState } from "react";
import { paginatedIndexesConfig,useChainId, useContractInfiniteReads } from "wagmi";

import { web3StorageLink } from "@/utils/web3Storage";

import OutputCallingInvest from "./Output/CallingInvest";
import OutputFunding from "./Output/Funding";
import OutputVoting from "./Output/Voting";
import FactbookAbi from '../../../contract/out/Factbook.sol/Factbook.json'
import FactbookAddress from '../../../contract/contractInfo.json'

export default function NewFeed({count}:{count:number}) {

  const ZContractConfig = {
    // eslint-disable-next-line
    // @ts-ignore
    address: FactbookAddress.deployedTo as `0x${string}`,
    abi: FactbookAbi.abi as any,
  }

  // eslint-disable-next-line
  // @ts-ignore
  const { data, fetchNextPage } = useContractInfiniteReads({
    cacheKey: 'newfeed',
    ...paginatedIndexesConfig(
      // eslint-disable-next-line
      // @ts-ignore
      (index:any) => {
        return [
          {
            ...ZContractConfig,
            functionName: 'feeds',
            args: [index] as const,
          },
        ]
      },
      { start: count-1, perPage: 10, direction: 'decrement' },
    ),
    cacheTime: 10_000,
  })
  return (
    <div className="flex flex-col gap-4">
      {data && data.pages[0].map((feed:any) =>(
        <div key={feed.result[1]}>
          <Feed type={feed.result[0]} cid={feed.result[1]} contractAddress={feed.result[2]} roundId={feed.result[4]}/>
        </div>
      ))}
    </div>
  )
}

const Feed = ({type, cid, contractAddress, roundId}:any) => {
  const [feed, setFeed] = useState<any>(null)

  useEffect(() => {
    const fetchData = async (cid: string) => {
      try {
        const response = await axios.get(web3StorageLink(cid));

        setFeed(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (cid) fetchData(cid as any);
  }, [cid]);

  return(
    <div className="text-base-content bg-base-200 rounded-lg p-4 hover:bg-base-300 cursor-pointer border border-primary">
      {feed ?
        <div className="grid grid-cols-12 gap-2">
          <div className="avatar">
            <div className="w-12 h-12 rounded-xl border border-primary">
              <img src={`https://robohash.org/${feed.owner}&200x200`} />
            </div>
          </div>
          <div className="col-span-11">
            <div className="flex justify-between mb-2">
              <p className="font-bold text-secondary">{feed.owner}</p>
            </div>
            {type === 0 ? <OutputVoting content={feed.content} options={feed.voteOptions} contractAddress={contractAddress} /> :
            type === 1 ? <OutputFunding content={feed.content} options={feed.mediaList} contractAddress={contractAddress} /> :
            <OutputCallingInvest content={feed.content} owner={feed.owner} erc20contract={feed.erc20contract} roundId={roundId}/> }
          </div>
        </div>
        :
        <div className="grid grid-cols-12 gap-2">
          <div className="avatar">
            <div className="w-12 h-12 skeleton rounded-xl" />
          </div>
          <div className="col-span-11">
              <div className="flex justify-between mb-2">
                <p className="skeleton w-24"></p>
              </div>
              <div className="skeleton w-full h-64">
              </div>
            </div>
        </div>
      }
    </div>
  )
}