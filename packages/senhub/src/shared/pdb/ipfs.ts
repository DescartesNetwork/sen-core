import { create, isIPFS } from 'ipfs-core'
import { asyncWait } from 'shared/util'

class IPFS {
  private _ipfs: any = async () => {
    try {
      if (!window.ipfs) window.ipfs = await create()
      return window.ipfs
    } catch (er) {
      await asyncWait(500)
      return await this._ipfs()
    }
  }

  static isCID = (cid: string | undefined | null): boolean => {
    try {
      if (!cid) return false
      return isIPFS.multihash(cid)
    } catch (er) {
      return false
    }
  }

  get = async (cid: string) => {
    if (!IPFS.isCID(cid)) throw new Error('Invalid CID')
    const ipfs = await this._ipfs()
    const stream = await ipfs.cat(cid)
    let raw = ''
    for await (const chunk of stream) raw += Buffer.from(chunk).toString()
    const data = JSON.parse(raw)
    return data
  }

  set = async (data: object): Promise<string> => {
    if (!data) throw new Error('Empty data')
    const raw = JSON.stringify(data)
    const ipfs = await this._ipfs()
    const { cid } = await ipfs.add(raw)
    return cid.toString()
  }
}

export default IPFS
