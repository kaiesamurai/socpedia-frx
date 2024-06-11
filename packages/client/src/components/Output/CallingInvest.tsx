'use client'

import { useAccount, useChainId, useContractReads, useContractRead } from 'wagmi';

import ModuleAbi from '../../../../contract/out/Module.sol/Module.json'
import FactbookAbi from '../../../../contract/out/Factbook.sol/Factbook.json'
import FactbookAddress from '../../../../contract/contractInfo.json'
import { useEffect, useState } from 'react';
import axios from 'axios';
import GetPriceByRoundId from '../GetPriceByRoundId';
import DataFeed from '../DataFeed';

export default function OutputCallingInvest({content, owner, erc20contract, roundId}:any) {
  // eslint-disable-next-line
  // @ts-ignore
  const { data: modules} = useContractRead({
    // eslint-disable-next-line
    // @ts-ignore
    address: FactbookAddress.deployedTo as `0x${string}`,
    abi: FactbookAbi.abi as any,
    functionName: 'getModules',
  })

  return (
    <div className='flex flex-col gap-4'>
      <p>{content}</p>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">ERC20</span>
        </div>
        <p className="h-12 w-full bg-base-300 rounded-lg p-3">{erc20contract.address}</p>
        <div className="label">
          <span className="label-text-alt">Name: {erc20contract.name}</span>
          <span className="label-text-alt">Symbol: {erc20contract.symbol}</span>
        </div>
      </label>
      {erc20contract && erc20contract.address.toString().length > 0 && roundId.toString().length > 0 &&
      <div className='grid grid-cols-5 gap-2'>
        <p className='col-span-1'>Price when calling:</p>
        <div className='col-span-4'>
          <GetPriceByRoundId tokenAddress={erc20contract.address} roundId={roundId.toString()}/>
        </div>
        <p className='col-span-1'>Price now:</p>
        <div className='col-span-4'>
          <DataFeed tokenAddress={erc20contract.address}/>
        </div>
      </div>
      }
      <div>
        <div className="divider"></div>
        <p>Module check</p>
        <div className='flex flex-col gap-2 mt-4'>
          {
            modules && modules.map((module:any) => (
              <ModuleCheck key={module} moduleAddress={module} owner={owner} erc20contract={erc20contract}/>
            ))
          }
        </div>
      </div>
    </div>
  )
}

const ModuleCheck = ({moduleAddress, owner, erc20contract}:any) => {
  const {address} = useAccount()
  const [metadata, setMetadata] = useState<any>(null)
  const [result, setResult] = useState("")

  const { data } = useContractReads({
    contracts: [{
      address: moduleAddress as `0x${string}`,
      abi: ModuleAbi.abi as any,
      functionName: 'uri',
    },{
      address: moduleAddress as `0x${string}`,
      abi: ModuleAbi.abi as any,
      functionName: 'balanceOf',
      args: [address as string]
    }]
  })

  useEffect(() => {
    const fetchData = async (cid: string) => {
      try {
        const response = await axios.get(cid);

        setMetadata(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (data && data[0].result) fetchData(data[0].result as any);
  }, [data]);

  useEffect(() => {
    const runCode = async () => {
      if(metadata && metadata.code) {
        const wrap = (s:any) => "{ return " + metadata.code + " };" //return the block having function expression
        const func = new Function( wrap(metadata.code) );
        const value = await func.call( null ).call( null, owner, erc20contract );
        setResult(value)
      }
    }
    runCode()
  }, [metadata])

  if(data && Number(data[1].result) !== 0 && metadata ) {
    return(
      <div className='bg-base-300 p-4 rounded-lg flex flex-col gap-4 border border-primary'>
        <p>Module name: {metadata.name}</p>
        <p>{result}</p>
      </div>
    )
  } else {
    return <></>
  }
}