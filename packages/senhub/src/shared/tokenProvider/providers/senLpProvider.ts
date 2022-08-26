import { web3, Address } from '@project-serum/anchor'
import { MintData, utils } from '@senswap/sen-js'

import { DataLoader } from 'shared/dataloader'
import { chainId } from 'shared/runtime'
import BaseTokenProvider from './baseProvider'
import { splTokenProvider } from './splProvider'
import configs from 'configs'

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

  private getMintLptData = async (mintAddress: Address) => {
    const key = 'SenLpTokenProvider:getMintLptData'
    const connection = window.sentre.splt.connection
    const mapMintLpt = await DataLoader.load(key, async () => {
      const result = new Map<string, MintData>()
      const pools = await this.getPools()
      const mintLpts = pools.map(
        (pool) => new web3.PublicKey(pool.account.mint_lpt),
      )
      const mintLptDatas = await utils.wrappedGetMultipleAccountsInfo(
        connection,
        mintLpts,
      )
      mintLptDatas.forEach((mintLptData, index) => {
        if (!mintLptData?.data) return
        const mintData = window.sentre.splt.parseMintData(
          mintLptData.data as Buffer,
        )
        result.set(mintLpts[index].toBase58(), mintData)
      })
      return result
    })
    return mapMintLpt.get(mintAddress.toString())
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

  getPrice = async (mintLpt: Address): Promise<number> => {
    return DataLoader.load(`getPrice:${mintLpt}`, async () => {
      await this._init()
      const pools = await this.getPools()
      for (const pool of pools) {
        // Find pool with mintLpt
        const { mint_lpt, mint_a, mint_b, reserve_a, reserve_b } = pool.account
        if (mint_lpt !== mintLpt.toString()) continue
        // Get Mint LPT data
        const mintLptData = await this.getMintLptData(mintLpt)
        if (!mintLptData) return 0
        const amount = utils.undecimalize(mintLptData.supply, LPT_DECIMALS)
        if (!Number(amount)) return 0
        // Get pool TVL
        let tvl = 0
        const mints = [
          { mint: mint_a, amount: reserve_a },
          { mint: mint_b, amount: reserve_b },
        ]
        await Promise.all(
          mints.map(async ({ mint, amount }) => {
            const amountBN = BigInt(amount.toString())
            const tokenInfo = await splTokenProvider.findByAddress(mint)
            let decimals = tokenInfo?.decimals
            if (!decimals) {
              const mintData = await window.sentre.splt.getMintData(mint)
              decimals = mintData.decimals
            }
            const mintAmount = Number(utils.undecimalize(amountBN, decimals))
            if (!mintAmount) return 0

            const mintPrice = await splTokenProvider.getPrice(mint)
            tvl += mintAmount * mintPrice
          }),
        )
        return tvl / Number(amount)
      }
      return 0
    })
  }
}

export default SenLpTokenProvider
