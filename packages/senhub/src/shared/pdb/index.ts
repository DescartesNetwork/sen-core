import localForage from 'localforage'
import { isAddress } from 'shared/util'

/**
 * Persistent Database
 */
class PDB {
  readonly dbName: string
  private driver: any

  constructor(walletAddress: string) {
    if (!isAddress(walletAddress)) throw new Error('Invalid address')
    this.dbName = walletAddress
    this.driver = [localForage.WEBSQL, localForage.LOCALSTORAGE]
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
    const data: any = {}
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
}

export default PDB

/**
 * High abtraction pdb for app
 */
export const createPDB = (walletArress: string, appId: string) => {
  return isAddress(walletArress)
    ? new PDB(walletArress).createInstance(appId)
    : undefined
}
