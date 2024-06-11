'use client'
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react"
import { formatEther, parseEther } from "viem";
import { useAccount, useContractRead, useContractWrite } from "wagmi";

import FundingAbi from '../../../../contract/out/Funding.sol/Funding.json';

export default function OutputFunding({content, options, contractAddress}:any) {
  const {address} = useAccount()
  const [mediaList, setMediaList] = useState([{
    optionId: 0,
    name: "github",
    value: "",
    icon: "/svg/github.svg"
  },{
    optionId: 1,
    name: "twitter",
    value: "",
    icon: "/svg/twitter.svg"
  }]);

  const [fundingAmount, setFundingAmount] = useState(0)

  useEffect(() => {
    const mediaOptions = options.map((option:any, key:any) => ({optionId: option.optionId, value: option.value, name: option.name, icon: mediaList[key].icon}))

    setMediaList(mediaOptions)
  }, [])

  // eslint-disable-next-line
  // @ts-ignore
  const { data: fundBalance, refetch } = useContractRead({
    // eslint-disable-next-line
    // @ts-ignore
    address: contractAddress as `0x${string}`,
    abi: FundingAbi.abi as any,
    functionName: 'balanceOf',
    args: [address]
  })

  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const {
    data: transactionHash,
    // isLoading: isLoading,
    isSuccess: isSuccess,
    write: triggerFunding
  } = useContractWrite({
    // eslint-disable-next-line
    // @ts-ignore
    address: contractAddress as `0x${string}`,
    abi: FundingAbi.abi as any,
    functionName: 'funding',
  });

  const funding = () => {
    const toWei = parseEther(fundingAmount.toString())
    triggerFunding({
      args: [
        toWei,
      ],
      value: toWei
    });
  }

  return (
    <div className="text-base-content">
      <div>
        <p>{content}</p>
      </div>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Contacts</span>
        </div>
        <div className="flex gap-3">
          {mediaList.map((media) => (
            <div className="tooltip tooltip-primary" data-tip={media.value} key={media.optionId}>
              <Link href={media.value} rel="noopener noreferrer" target="_blank" >
                <Image height={23} width={23} alt="icon" src={media.icon}/>
              </Link>
            </div>
          ))}
        </div>
      </label>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Fundings</span>
          <span className="label-text-alt">Your domation {fundBalance ? formatEther(fundBalance as any).toString() : "0.0"} ETH</span>
        </div>
        <div className="flex gap-3">
          <input onChange={(e) => setFundingAmount(Number(e.target.value))} type="number" placeholder="0.01 ETH" className="flex-auto w-fit input input-bordered" />
          <button onClick={() => funding()} className="btn btn-accent">Fundings</button>
        </div>
      </label>
    </div>
  )
}