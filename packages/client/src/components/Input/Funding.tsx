import { useEffect, useState } from "react"
import { useAccount } from "wagmi";

export default function InputFunding({setPostData}:any) {
  const [mediaList, setMediaList] = useState([{
    optionId: 0,
    name: "github",
    value: ""
  },{
    optionId: 1,
    name: "twitter",
    value: ""
  }]);

  const {address} = useAccount()
  const [textArea, setTextArea] = useState("")

  const addOption = () => {
    setMediaList(mediaList => [...mediaList, {
      optionId: mediaList.length,
      name: "website",
      value: ""
    }]);
  }

  const removeOption = (id: number) => {
    const z = mediaList.filter((z) => z.optionId !== id);
    setMediaList(z);
  }

  useEffect(() => {
    setPostData({
      content: textArea,
      mediaList: mediaList,
      currency: "0x0000000000000000000000000000000000000000",
      owner: address
    })
  }, [mediaList, textArea])

  const addOptionValue = (optionId: number, value: string) => {
    const updatedOptions = mediaList.map((option) =>
      option.optionId === optionId ? { ...option, value: value } : option
    );
    setMediaList(updatedOptions);
  }

  return (
    <div className="text-base-content">
      <label className="form-control">
        <div className="label">
          <span className="label-text">Describe project</span>
        </div>
        <textarea onChange={(e) => setTextArea(e.target.value)} value={textArea} className="textarea textarea-bordered h-24" placeholder="Bio"></textarea>
      </label>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Contacts</span>
        </div>
        <div className="flex gap-3 flex-col">
          {mediaList.map((media) => (
            <div key={media.optionId} className="flex gap-2">
              <input onChange={(e) => addOptionValue(media.optionId, e.target.value)} type="text" placeholder={media.name} className="flex-auto w-fit input input-bordered" />
              <button onClick={() => removeOption(media.optionId)} className="btn btn-outline btn-error w-12">x</button>
            </div>
          ))}
          <div onClick={() => addOption()} className="border border-neutral-content border-dashed w-full font-bold text-xl place-items-center px-4 py-2 h-12 rounded-md cursor-pointer"> + </div>
        </div>
      </label>
      <label className="form-control">
        <div className="label">
          <span className="label-text">Currency</span>
        </div>
        <label className="label cursor-pointer">
          <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
          <span className="label-text">ETH</span>
        </label>
      </label>
    </div>
  )
}