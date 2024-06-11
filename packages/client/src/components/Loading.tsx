import { useEffect } from "react"

export default function Loading({state}:{state:number}) {
  const modal = document.getElementById('loading_modal')

  useEffect(() => {
    const run = async () =>{
      if(state > 0) {
        // eslint-disable-next-line
        // @ts-ignore
        modal.showModal()
      }else{
        // eslint-disable-next-line
        // @ts-ignore
        modal?.close()
      }
    }
    run()
  }, [state])

  return(
    <dialog id="loading_modal" className="modal">
      <div className="modal-box flex flex-col items-center gap-2">
        <h3 className="font-bold text-lg">Loading</h3>
        <p className="py-4">
          {state === 1 ? "Upload state to web3.storage" : "Commit Zip to smartcontract"}
        </p>
        <span className="loading loading-spinner loading-lg"></span>
        <ul className="timeline flex justify-between">
          <li>
            <div className="timeline-start timeline-box text-white">Upload Web3.storage</div>
            <div className="timeline-middle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${state >= 2 && "text-primary"}`}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
            </div>
            <hr className={`${state >= 3 && "bg-primary"}`}/>
          </li>
          <li>
            <hr className={`${state >= 3 && "bg-primary"}`}/>
            <div className="timeline-start timeline-box text-white">Commit Zip</div>
            <div className="timeline-middle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${state >= 3 && "text-primary"}`}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
            </div>
          </li>
        </ul>
      </div>
    </dialog>
  )
}