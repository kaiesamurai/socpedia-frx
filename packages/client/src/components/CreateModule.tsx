'use client'
import Editor from '@monaco-editor/react';
import { useEffect, useState } from "react"
import { parseEther } from "viem";
import { useContractWrite } from "wagmi";

import { delay } from "@/utils/delay";
import { uploadWeb3Storage, web3StorageLink } from "@/utils/web3Storage";

import Loading from "./Loading";
import FactbookAbi from '../../../contract/out/Factbook.sol/Factbook.json';
import FactbookAddress from '../../../contract/contractInfo.json'

export default function CreateModule() {
  const [file, setFile] = useState<any>(null);
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [code, setCode] = useState('')
  const [status, setStatus] = useState(0)

  const {
    data: transactionHash,
    // isLoading: isLoading,
    isSuccess: isSuccess,
    write: triggerCreateModule
  } = useContractWrite({
    // eslint-disable-next-line
    // @ts-ignore
    address: FactbookAddress.deployedTo as `0x${string}`,
    abi: FactbookAbi.abi as any,
    functionName: 'createModule',
    // maxFeePerGas: parseGwei('20'),
  });

  const addNewModule = async(content: string) => {
    triggerCreateModule({
      args: [
        name,
        symbol,
        content,
        parseEther(price)
      ],
    });
  }

  const openCreateModal = () => {
    // eslint-disable-next-line
    // @ts-ignore
    document.getElementById('create_modal').showModal()
  }

  function handleEditorChange(value:any, event:any) {
    setCode(value);
  }

  const create = async () => {
    setStatus(1) // start upload
    // upload image
    const imageCid = await uploadWeb3Storage(file)
    // upload metadata
    const metadata = {
      name: name,
      description: description,
      image: imageCid,
      code: code
    }
    const stringData = JSON.stringify(metadata)
    const files = new File([stringData], "module.json")
    const cid = await uploadWeb3Storage(files)
    setStatus(2) // set contract
    await addNewModule(web3StorageLink(cid))
  }

  useEffect(() => {
    const checkSuccess = async() => {
      if (isSuccess) {
        setStatus(3)
        await delay(2000)
        setStatus(0)
        setName("")
        setSymbol("")
        setPrice("")
        setCode("")
        // eslint-disable-next-line
        // @ts-ignore
        document.getElementById('create_modal')?.close()
      }
    }
    checkSuccess()
  }, [isSuccess])

  const handleChange = (event:any) => {
		setFile(event.target.files[0]);
	};

  return(
    <div>
      <Loading state={status} />
      <button onClick={() => openCreateModal()} className="btn btn-secondary w-24 text-xl">Create</button>
      <dialog id="create_modal" className="modal">
        <div className="modal-box gap-2">
          <h3 className="font-bold text-lg">Create Module</h3>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Upload module image</span>
            </div>
            <input onChange={handleChange} type="file" className="file-input file-input-bordered file-input-primary w-full" />
          </label>
          <div className=" grid grid-cols-2 gap-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Module Name</span>
              </div>
              <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Type name" className="input input-bordered w-full" />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Module Symbol</span>
              </div>
              <input onChange={(e) => setSymbol(e.target.value)} value={symbol} type="text" placeholder="Type symbol" className="input input-bordered w-full" />
            </label>
          </div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Price (ETH)</span>
            </div>
            <input onChange={(e) => setPrice(e.target.value)} value={price} type="number" placeholder="0.01" className="input input-bordered w-full" />
          </label>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Describe you module</span>
            </div>
            <textarea onChange={(e) => setDescription(e.target.value)} value={description} className="textarea textarea-bordered h-24" placeholder="Bio"></textarea>
          </label>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Implement module code</span>
            </div>
            <Editor
              height="150px"
              defaultLanguage="javascript"
              defaultValue={`async function module(zipOwner, erc20Address) {
  const balance = await window.ethereum.request({
    "method": "eth_getBalance",
    "params": [
      zipOwner,
    ]
  });
  return balance;
}`}
              onChange={handleEditorChange}
              theme="vs-dark"
            />
          </label>
          <div className='mt-8 flex flex-row-reverse'>
            <button onClick={() => create()} className="btn btn-outline btn-accent w-32">Create !!!</button>
          </div>
        </div>
      </dialog>
    </div>
  )
}