import { Address, BN } from '@project-serum/anchor'
import { utils } from '@senswap/sen-js'
import { TokenListProvider } from '@solana/spl-token-registry'

import { DataLoader } from 'shared/dataloader'
import supplementary, { sntr, sol } from '../supplementary'
import BaseTokenProvider from './baseProvider'

class SplTokenProvider extends BaseTokenProvider {
  constructor() {
    super()
    this._init()
  }

  getTokenList = async () => {
    let tokenList = await (await new TokenListProvider().resolve())
      .filterByChainId(this.chainId)
      .getList()
    if (this.cluster === 'devnet') tokenList = tokenList.concat(supplementary)
    if (this.cluster === 'testnet')
      tokenList = tokenList.concat([sntr(102), sol(102)])
    else tokenList = tokenList.concat([sol(101)])
    return tokenList
  }

  findAtomicTokens = async (addr: Address) => {
    if (!this.tokenMap.has(addr.toString())) return undefined
    return [this.tokenMap.get(addr.toString())]
  }

  getPrice = async (addr: Address): Promise<number> => {
    await this._init()
    if (!this.tokenMap.has(addr.toString())) return 0
    try {
      const price = await this.getPriceCgk(addr.toString())
      if (price) return price
    } catch (err) {
      console.log(err)
    }
    return this.getJupiterPrice(addr.toString())
  }

  getTotal = async (addr: Address, amountBN: BN): Promise<number> => {
    const token = await this.findByAddress(addr)
    if (!token || amountBN.isZero()) return 0
    // Get price
    const price = await this.getPrice(addr)
    if (!price) return 0
    // Get decimals
    let decimals = token?.decimals
    if (!decimals) {
      const mintData = await window.sentre.splt.getMintData(addr.toString())
      decimals = mintData.decimals
    }
    const amount = Number(
      utils.undecimalize(BigInt(amountBN.toString()), decimals),
    )
    return price * amount
  }

  private getPriceCgk = async (mintAddress: Address) => {
    const token = await this.findByAddress(mintAddress)
    const ticket = token?.extensions?.coingeckoId
    if (!ticket) return undefined

    const CGKTokenInfo = await DataLoader.load('getPriceCgk' + ticket, () =>
      utils.parseCGK(ticket),
    )
    const price = CGKTokenInfo.price
    return price
  }

  private getJupiterPrice = async (mintAddress: string) => {
    const priceUrl = `https://quote-api.jup.ag/v1/quote?inputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&outputMint=${mintAddress}&amount=1000000&slippage=1`
    const { data } = await DataLoader.load(
      'getJupiterPrice' + mintAddress,
      async () => (await fetch(priceUrl)).json(),
    )
    const token = await this.findByAddress(mintAddress)
    const bestOutput = await utils.undecimalize(
      BigInt(data[0].outAmount),
      token?.decimals || 0,
    )
    return 1 / Number(bestOutput)
  }
}

export default SplTokenProvider
export const splTokenProvider = new SplTokenProvider()
