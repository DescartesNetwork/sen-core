import { web3, Address, BN } from '@project-serum/anchor'

import { DataLoader } from 'shared/dataloader'
import { chainId } from 'shared/runtime'
import BaseTokenProvider from './baseProvider'
import { splTokenProvider } from './splProvider'
import configs from 'configs'
import { utils } from '@senswap/sen-js'

const LPT_DECIMALS = 9
const {
  sol: { taxmanAddress },
} = configs

class SenLpTokenProvider extends BaseTokenProvider {
  constructor() {
    super()
    this._init()
  }

  private getPools = async () => {
    const swapProgram = window.sentre?.swap
    if (!swapProgram) return []
    const key = 'SenLpTokenProvider:getPools'
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
      return value.map(({ account: { data } }) => {
        return { account: { ...swapProgram.parsePoolData(data) } }
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
          decimals: LPT_DECIMALS,
          name: 'SenSwap LP',
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

  getPrice = async (addr: Address): Promise<number | undefined> => {
    console.log('Call price SPL')
    await this._init()
    if (!this.tokenMap.has(addr.toString())) return undefined
    const pools = await this.getPools()
    for (const pool of pools) {
      const { mint_lpt, mint_a, mint_b, reserve_a, reserve_b } = pool.account
      if (mint_lpt !== addr.toString()) continue
      const mints = [
        { mint: mint_a, amount: reserve_a },
        { mint: mint_b, amount: reserve_b },
      ]
      // Get pool TVL
      let tvl = 0
      await Promise.all(
        mints.map(async ({ mint, amount }) => {
          const total = await splTokenProvider.getTotal(
            mint,
            new BN(amount.toString()),
          )
          tvl += total
        }),
      )
      // Get total supply
      const mintData = await window.sentre.splt.getMintData(addr.toString())
      const amount = utils.undecimalize(mintData.supply, mintData.decimals)
      if (!amount) return 0
      return tvl / Number(amount)
    }
    return undefined
  }
}

export default SenLpTokenProvider
