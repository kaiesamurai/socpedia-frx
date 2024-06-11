'use client'
import axios from "axios";
import Image from "next/image";
import { useRouter } from 'next/router'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatEther } from "viem";
import { useAccount, useContractReads, useContractWrite } from "wagmi";

import LeftBar from "@/components/AppLayout/LeftBar";

import { web3StorageLink } from "@/utils/web3Storage";

import ModuleAbi from '../../../../contract/out/Module.sol/Module.json'

export default function ModuleDetails() {
  return (
		<div className='grid grid-cols-12'>
			<div className='col-span-3'>
				<LeftBar />
			</div>
			<div className="col-span-9 p-4">
				<Detail />
			</div>
		</div>
	)
}

const Detail = () => {
  const router = useRouter()
  const {address} =useAccount()
  const [metadata, setMetadata] = useState<any>(null)
  // Read token
  // eslint-disable-next-line
  // @ts-ignore
  const { data } = useContractReads({
    contracts: [{
      address: router.query.address as `0x${string}`,
      abi: ModuleAbi.abi as any,
      functionName: 'uri',
    },{
      address: router.query.address as `0x${string}`,
      abi: ModuleAbi.abi as any,
      functionName: 'price',
    },{
      address: router.query.address as `0x${string}`,
      abi: ModuleAbi.abi as any,
      functionName: 'owner',
    },{
      address: router.query.address as `0x${string}`,
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

  const {
    data: transactionHash,
    // isLoading: isLoading,
    isSuccess: isSuccess,
    write: triggerBuy
  } = useContractWrite({
    // eslint-disable-next-line
    // @ts-ignore
    address: router.query.address as `0x${string}`,
    abi: ModuleAbi.abi as any,
    functionName: 'safeMint',
    // maxFeePerGas: parseGwei('20'),
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        `Transaction has been created successfully:
        ${transactionHash?.hash}`
      );
    }
  }, [isSuccess]);

  const buy = () => {
    if(data) {
      const toWei = data[1].result as any
      triggerBuy({
        args: [
          address,
          toWei
        ],
        value: toWei
      });
    }
  }
  return (
    <div className="grid grid-cols-8 gap-4">
      <div className="col-span-3">
        <div className="border-2 border-primary rounded-lg gap-2 p-2 min-h-[600px] flex flex-col">
          <div className="h-[36px] w-full flex justify-between">
            <Image src="/png/arbitrum.png" width={36} height={36} alt="ARB" />
          </div>
          <div className="flex-auto h-full flex justify-center items-center">
          {
            metadata ? (
              <img
                className='h-96 w-full object-cover'
                src={web3StorageLink(metadata.image)}
                alt='nft image'
              />
            ) : (
              <div className='skeleton h-96 w-full'></div>
            )
          }
          </div>
        </div>
      </div>
      <div className="col-span-5 p-4 flex flex-col gap-4">
        <div className="flex justify-between">
          <p className="text-5xl">{metadata && metadata.name}</p>
          <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-outline btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border">
            <li><a>Report</a></li>
          </ul>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="">Owner: {data && data[2].result as any}</p>
        </div>
        <div className="bg-base-200 p-4 rounded-lg">
          <div className="flex justify-between">
            <p className="text-2xl">Description</p>
          </div>
          <div className="divider"></div>
          <div className="flex flex-col gap-2">
            <p className="text-base">{metadata && metadata.description}</p>
          </div>
        </div>
        <div className="bg-base-200 p-4 rounded-lg">
          <div className="flex justify-between">
            <p className="text-2xl">Code</p>
          </div>
          <div className="divider"></div>
          <div className="flex flex-col gap-2">
            <p className="text-base">{metadata && metadata.code}</p>
          </div>
        </div>
        <div className="bg-base-200 p-4 rounded-lg">
          <p className="text-2xl">
            Buy
          </p>
          <div className="divider"></div>
          <div className="flex flex-col gap-2">
            <p className="text-3xl">{(data && data[1].result) ? formatEther(data[1].result as any).toString() : "Loading"} ETH</p>
            <div className="flex gap-4 items-end">
              {
                (data && Number(data[3].result) === 0) ?
                <button onClick={() => buy()} className="btn btn-accent w-48">Buy</button>
                :
                <button disabled className="btn w-48">Owned</button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}