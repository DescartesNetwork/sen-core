import { Address } from '@project-serum/anchor'
import { TokenListProvider } from '@solana/spl-token-registry'

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
}

export default SplTokenProvider
export const splTokenProvider = new SplTokenProvider()
