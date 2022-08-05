import { web3, Address } from '@project-serum/anchor'

import { DataLoader } from './../../dataloader/index'
import TokenProviderBase from './baseProvider'
import { chainId } from 'shared/runtime'
import configs from 'configs'
import { splTokenProvider } from './splProvider'

const {
  sol: { taxmanAddress },
} = configs

class SenLpTokenProvider extends TokenProviderBase {
  constructor() {
    super()
    this._init()
  }

  private getPools = async () => {
    const key = 'SenLpTokenProvider:getPools'
    const swapProgram = window.sentre?.swap
    if (!swapProgram) return []

    return DataLoader.load(key, async () => {
      // Get all pools
      const value: Array<{
        pubkey: web3.PublicKey
        account: web3.AccountInfo<Buffer>
      }> = await swapProgram.connection.getProgramAccounts(
        swapProgram.swapProgramId,
        {
          filters: [
            { dataSize: 257 },
            { memcmp: { bytes: taxmanAddress, offset: 65 } },
          ],
        },
      )
      return value.map((elm) => {
        return { account: { ...swapProgram.parsePoolData(elm.account.data) } }
      })
    })
  }

  getTokenList = async () => {
    const pools = await this.getPools()
    return Promise.all(
      pools.map(async (pool) => {
        const { mint_lpt } = pool.account
        const tokens = await this.findAtomicTokens(mint_lpt)
        return {
          address: mint_lpt,
          chainId: chainId,
          decimals: 9,
          name: tokens?.map((token) => token?.name).join(' • ') || '',
          symbol: tokens?.map((token) => token?.symbol).join(' • ') || '',
        }
      }),
    )
  }

  findAtomicTokens = async (addr: Address) => {
    const pools = await this.getPools()
    for (const pool of pools) {
      const { mint_lpt, mint_a, mint_b } = pool.account
      if (mint_lpt !== addr.toString()) continue
      return Promise.all(
        [mint_a, mint_b].map((mint) => splTokenProvider.findByAddress(mint)),
      )
    }
    return undefined
  }
}

export default SenLpTokenProvider
