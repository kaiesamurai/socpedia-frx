import { useEffect, useState } from "react"
import { useChainId, useContractWrite } from "wagmi"

import { delay } from "@/utils/delay"
import {uploadWeb3Storage} from "@/utils/web3Storage"

import InputCallingInvest from "./Input/CallingInvest"
import InputFunding from "./Input/Funding"
import InputVoting from "./Input/Voting"
import Loading from "./Loading"
import FactbookAbi from '../../../contract/out/Factbook.sol/Factbook.json';
import FactbookAddress from '../../../contract/contractInfo.json'

export default function Zip() {
  const [zipType, setZipType] = useState(0)
  const [postData, setPostData] = useState<any>([])
  const [status, setStatus] = useState(0)
  const [roundId, setRoundId] = useState("0")

  const {
    data: transactionHash,
    // isLoading: isLoading,
    isSuccess: isSuccess,
    write: triggerAddNewFeed
  } = useContractWrite({
    // eslint-disable-next-line
    // @ts-ignore
    address: FactbookAddress.deployedTo as `0x${string}`,
    abi: FactbookAbi.abi as any,
    functionName: 'addNewFeed',
    // maxFeePerGas: parseGwei('20'),
  });

  const addNewFeed = async(content: string) => {
    const today = new Date()
    const endTime = new Date(today.setDate(today.getDate() + Number(2)))
    triggerAddNewFeed({
      args: [
        zipType,
        content,
        (endTime.getTime()-(endTime.getTime()%1000))/1000,
        roundId
      ],
    });
  }

  const zipList = [{
    id: 0,
    name: "Voting",
  },{
    id: 1,
    name: "Fundings",
  },{
    id: 2,
    name: "Calling for investment",
  }]

  const handleOpenModal = () => {
    // eslint-disable-next-line
    // @ts-ignore
    document.getElementById('zip').showModal()
  }

  const post = async (data:any) => {
    if(Object.keys(data).length !== 0) {
      setStatus(1) // start upload
      const stringData = JSON.stringify(data)
      const files = new File([stringData], "feed.json")
      const cid = await uploadWeb3Storage(files)
      setStatus(2) // set contract
      await addNewFeed(cid)
    }
  }

  useEffect(() => {
    const checkSuccess = async() => {
      if (isSuccess) {
        setStatus(3)
        await delay(2000)
        setStatus(0)
        setPostData([])
        // eslint-disable-next-line
        // @ts-ignore
        document.getElementById('zip')?.close()
      }
    }
    checkSuccess()
  }, [isSuccess])

  return (
    <div className="">
      <Loading state={status}/>
      <input onClick={()=>handleOpenModal()} type="text" placeholder="Start Zip" className="input input-bordered border-primary w-full" />
      <dialog id="zip" className="modal">
        <div className='modal-box text-black'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-outline btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <h3 className='font-bold text-primary text-lg mb-4'>Let's Zip</h3>
          <div className='flex gap-4 mb-4'>
            {zipList.map(zip =>(
              <div onClick={() => setZipType(zip.id)} key={zip.id} className={`py-2 px-4 border-primary border rounded-lg cursor-pointer ${zipType===zip.id && "bg-primary/40"}`}>
                <p className="text-base-content font-bold">{zip.name}</p>
              </div>
            ))}
          </div>
          {
            zipType === 0 ?
              <InputVoting setPostData={setPostData}/>
            : zipType ===1 ?
              <InputFunding setPostData={setPostData}/>
            :<InputCallingInvest setRoundId={setRoundId} setPostData={setPostData}/>
          }
          <div className='mt-8 flex flex-row-reverse'>
            <button disabled={!Object.keys(postData).length} onClick={() => post(postData)} className="btn btn-outline btn-accent w-24">Zip !!!</button>
          </div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </div>
  )
}