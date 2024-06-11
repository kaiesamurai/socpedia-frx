import { create } from '@web3-storage/w3up-client'

export async function uploadWeb3Storage (data:any) {
    const client = await create()
    const myAccount = await client.login(process.env.NEXT_PUBLIC_WEB3_STORAGE_EMAIL as `${string}@${string}`)
    await myAccount.provision(process.env.NEXT_PUBLIC_WEB3_STORAGE_SPACE_DID as `did:key:${string}`)
    await client.setCurrentSpace(process.env.NEXT_PUBLIC_WEB3_STORAGE_SPACE_DID as `did:${string}:${string}`)

    const cid = await client.uploadFile(data);
    return cid.toString()
}

export function web3StorageLink (cid:string) {
    return `https://${cid}.ipfs.w3s.link`
}