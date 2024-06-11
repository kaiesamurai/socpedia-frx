import { useEffect, useState } from "react"
import { useAccount } from "wagmi";

export default function InputVoting({setPostData}:any) {
  const [votingList, setVotingList] = useState([{
    optionId: 0,
    value: ""
  },{
    optionId: 1,
    value: ""
  }]);

  const {address} = useAccount()

  const [textArea, setTextArea] = useState("")

  const addOption = () => {
    setVotingList(votingList => [...votingList, {
      optionId: votingList.length,
      value: ""
    }]);
  }

  const removeOption = (id: number) => {
    const z = votingList.filter((z) => z.optionId !== id);
    setVotingList(z);
  }

  const addOptionValue = (optionId: number, value: string) => {
    const updatedOptions = votingList.map((option) =>
      option.optionId === optionId ? { ...option, value: value } : option
    );
    setVotingList(updatedOptions);
  }

  useEffect(() => {
    setPostData({
      content: textArea,
      voteOptions: votingList,
      owner: address
    })
  }, [votingList, textArea])

  return (
    <div className="text-base-content">
      <label className="form-control">
        <div className="label">
          <span className="label-text">Describe vote</span>
        </div>
        <textarea onChange={(e) => setTextArea(e.target.value)} value={textArea} className="textarea textarea-bordered h-24" placeholder="Describe what do you want to vote"></textarea>
      </label>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Vote options</span>
        </div>
        <div className="flex gap-3 flex-col">
          {votingList.map((voting) => (
            <div key={voting.optionId} className="flex gap-2">
              <input onChange={(e) => addOptionValue(voting.optionId,e.target.value)} type="text" placeholder="Options" className="flex-auto w-fit input input-bordered" />
              <button onClick={() => removeOption(voting.optionId)} className="btn btn-outline btn-error w-12">x</button>
            </div>
          ))}
          <div onClick={() => addOption()} className="border border-neutral-content border-dashed w-full font-bold text-xl place-items-center px-4 py-2 h-12 rounded-md cursor-pointer"> + </div>
        </div>
      </label>
    </div>
  )
}