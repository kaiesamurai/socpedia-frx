import { useEffect, useState } from "react"

export default function OutputVoting({content, options, contractAddress}:any) {
  const [voteOptions, setVoteOptions] = useState<any>([]);

  useEffect(() => {
    const voteOptions = options.map((option:any) => ({optionId: option.optionId, value: option.value, count:0}))

    setVoteOptions(voteOptions)
  }, [])

  const [totalVotes, setTotalVotes] = useState(0);

  const handleVote = (optionId: number) => {
    const updatedOptions = voteOptions.map((option:any) =>
      option.optionId === optionId ? { ...option, count: option.count + 1 } : option
    );
    setVoteOptions(updatedOptions);
    setTotalVotes(totalVotes + 1);
  };

  return (
    <div className="text-base-content">
      <div>
        <p>{content}</p>
      </div>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Vote options</span>
        </div>
        <div className="flex gap-3 flex-col">
        {voteOptions.map((option:any) => (
          <div key={option.optionId} className="flex items-center mb-2">
            <div onClick={() => handleVote(option.optionId)} className="relative font-bold flex-grow h-12 bg-base-100 rounded-lg p-4 cursor-pointer flex justify-between items-center text-white">
              <div
                className="absolute top-0 left-0 h-full bg-accent rounded flex justify-between items-center"
                style={{ width: `${(option.count / totalVotes) * 100}%` }}
              >
              </div>
              <p className="z-10">{option.value}</p>
              <p className="z-10">{totalVotes === 0 ? "0" :`${((option.count / totalVotes) * 100).toFixed(2)}%`}</p>
            </div>
          </div>
        ))}
        </div>
      </label>
    </div>
  )
}