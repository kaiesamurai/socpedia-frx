'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAccount, useContractRead, useContractReads } from "wagmi";

import { web3StorageLink } from '@/utils/web3Storage';

import ModuleAbi from '../../../../contract/out/Module.sol/Module.json'
import FactbookAbi from '../../../../contract/out/Factbook.sol/Factbook.json'
import FactbookAddress from '../../../../contract/contractInfo.json'

export default function RightBar() {
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
    <div className="p-4">
      <p className="text-2xl">Your modules</p>
      <div className='grid grid-cols-2 gap-8 mt-4'>
        {modules && modules.map((module:any) =>
          <div key={module}>
            <ModuleIcon contractAddress={module}/>
          </div>
        )}
      </div>
    </div>
  )
}

const ModuleIcon = ({contractAddress}:{contractAddress:string}) => {
  const {address} = useAccount()
  const [metadata, setMetadata] = useState<any>()
  const { data } = useContractReads({
    contracts: [{
      address: contractAddress as `0x${string}`,
      abi: ModuleAbi.abi as any,
      functionName: 'uri',
    },{
      address: contractAddress as `0x${string}`,
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

  if(data && Number(data[1].result) > 0) {
    return(
      <div className='h-32 w-32 p-4 border border-primary rounded-lg'>
        {metadata ?
          <figure><img className="h-24 w-24 rounded-lg" src={web3StorageLink(metadata.image)} alt="image" /></figure>
        :
          <div className='skeleton w-24 h-24 rounded-lg'></div>
        }
      </div>
    )
  } else {
    return <></>
  }
}