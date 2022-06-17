import localForage from 'localforage'
import { account } from '@senswap/sen-js'
import IPFS from './ipfs'

/**
 * Persistent Database
 */
class PDB {
  readonly dbName: string
  private driver: any
  private ipfs: IPFS

  constructor(walletAddress: string) {
    if (!account.isAddress(walletAddress)) throw new Error('Invalid address')
    this.dbName = walletAddress
    this.driver = [localForage.WEBSQL, localForage.LOCALSTORAGE]
    this.ipfs = new IPFS()
  }

  /**
   * Local
   */

  createInstance = (appId: string): LocalForage => {
    return localForage.createInstance({
      driver: this.driver,
      name: this.dbName,
      storeName: appId,
    })
  }

  dropInstance = async (appId: string): Promise<void> => {
    const instance = this.createInstance(appId)
    await instance.clear()
    return await localForage.dropInstance({
      name: this.dbName,
      storeName: appId,
    })
  }

  all = async (): Promise<any> => {
    let data: any = {}
    const appIds = (
      ((await this.createInstance('sentre').getItem('appIds')) as string[]) ||
      []
    )
      .flat()
      .concat(['sentre'])
    for (const appId of appIds) {
      data[appId] = {}
      const instance = this.createInstance(appId)
      await instance.iterate((value: string, key: string) => {
        data[appId][key] = value
      })
    }
    return data
  }

  /**
   * Cloud
   */

  fetch = async (cid: string) => {
    return await this.ipfs.get(cid)
  }

  backup = async () => {
    const data = await this.all()
    return await this.ipfs.set(data)
  }

  restore = async (cid: string) => {
    // Download data
    const data = await this.fetch(cid)
    // Apply to storage
    for (const appId in data) {
      const instance = await this.createInstance(appId)
      for (const key in data[appId]) {
        const value = data[appId][key]
        await instance.setItem(key, value)
      }
    }
    return data
  }
}

export default PDB

/**
 * High abtraction pdb for app
 */
export const createPDB = (walletArress: string, appId: string) => {
  return account.isAddress(walletArress)
    ? new PDB(walletArress).createInstance(appId)
    : undefined
}
