import axios from 'axios';
import Link from "next/link"
import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useChainId, useContractRead, useContractReads } from "wagmi";

import LeftBar from "@/components/AppLayout/LeftBar"
import CreateModule from "@/components/CreateModule"

import { web3StorageLink } from "@/utils/web3Storage";

import ModuleAbi from '../../../../contract/out/Module.sol/Module.json'
import FactbookAbi from '../../../../contract/out/Factbook.sol/Factbook.json'
import FactbookAddress from '../../../../contract/contractInfo.json'

export default function Modules() {
  const chainId = useChainId()
	// Read token
  // eslint-disable-next-line
  // @ts-ignore
  const { data: modules, isError, isSuccess } = useContractRead({
    // eslint-disable-next-line
    // @ts-ignore
    address: FactbookAddress.deployedTo as `0x${string}`,
    abi: FactbookAbi.abi as any,
    functionName: 'getModules',
  })

  return (
		<div className='grid grid-cols-12'>
			<div className='col-span-3'>
				<LeftBar />
			</div>
			<div className="col-span-9">
				<div className="pt-4 px-4 flex justify-end">
					<CreateModule />
				</div>
				<div className="p-4 grid grid-cols-4 gap-4">
					{modules && modules.map((module:any) =>
						<Link href={`/modules/${module}`} key={module}>
							<ModuleCard contractAddress={module}/>
						</Link>
					)}
				</div>
			</div>
		</div>
	)
}

const ModuleCard = ({contractAddress}:any) => {
  const [metadata, setMetadata] = useState<any>()
  // Read token
  // eslint-disable-next-line
  // @ts-ignore
  const { data, isError, isSuccess } = useContractReads({
    contracts: [{
      address: contractAddress as `0x${string}`,
      abi: ModuleAbi.abi as any,
      functionName: 'uri',
    },{
      address: contractAddress as `0x${string}`,
      abi: ModuleAbi.abi as any,
      functionName: 'price',
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

	return (
    <div className="card bg-base-100 shadow-xl border border-primary">
      <>
      {metadata && <>
        <figure><img className="h-48" src={web3StorageLink(metadata.image)} alt="Shoes" /></figure>
        <div className="card-body">
          <h2 className="card-title">
            {metadata.name}
            <div className="badge badge-secondary">NEW</div>
          </h2>
          <p>{metadata.description}</p>
          <div className="card-actions justify-end">
            <p>{(!!data && data[1].result) ? formatEther(data[1].result as any).toString() : "0.0" } ETH</p>
          </div>
        </div>
        </>}
      </>
    </div>
  )
}