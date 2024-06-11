import { useEffect, useState } from "react"
import { useAccount, useContractReads } from "wagmi"
import RoundId from "../RoundId"

const Erc20Abi = [
  {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
          {
              "name": "",
              "type": "string"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
        {
            "name": "",
            "type": "string"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
]

export default function InputCallingInvest({setPostData, setRoundId}:any) {
  const [textArea, setTextArea] = useState("")
  const [erc20contract, setErc20Contract] = useState("")
  const {address} = useAccount()

  // Read token
  const { data: token } = useContractReads({
  contracts: [
      {
        address: erc20contract as `0x${string}`,
        abi: Erc20Abi as any,
        functionName: 'name',
      },
      {
        address: erc20contract as `0x${string}`,
        abi: Erc20Abi as any,
        functionName: 'symbol',
      }
    ],
  });

  useEffect(() => {
    setPostData({
      content: textArea,
      owner: address,
      erc20contract: {
        address: erc20contract,
        name: token ? token[0].result : "",
        symbol :token ? token[1].result : ""
      },
    })
  }, [textArea, token])

  return (
    <div className="text-base-content">
      <label className="form-control">
        <div className="label">
          <span className="label-text">What you thinks</span>
        </div>
        <textarea onChange={(e) => setTextArea(e.target.value)} value={textArea} className="textarea textarea-bordered h-24" placeholder="Bio"></textarea>
      </label>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">ERC20 contract</span>
        </div>
        <input onChange={(e) => setErc20Contract(e.target.value)} type="text" placeholder="0x" className="input input-bordered w-full" />
        <div className="label">
          <span className="label-text-alt">Name: {token && token[0].result as any}</span>
          <span className="label-text-alt">Symbol {token && token[1].result as any}</span>
        </div>
      </label>
      {erc20contract.length > 0 &&
        <div>
          <RoundId tokenAddress={erc20contract} setRoundId={setRoundId} />
        </div>
      }
    </div>
  )
}
